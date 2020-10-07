<template lang="pug">
  div.monaco-editor(ref="monacoEditor" @paste="onPasteFile($event)" @drop="onDropFile($event)" @dragover="$event.preventDefault()")
</template>

<script>
import api from '../../api';

export default {
  name: 'Monaco',
  props: {
    value: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      monaco: null,
      uploadId: 0,
    };
  },
  watch: {
    value (newValue) {
      if (this.monaco) {
        if (newValue === this.monaco.getValue()) {
          return;
        }
        this.monaco.setValue(newValue || '');
      }
    },
    language (language) {
      const formatLUT = {
        'jade': 'pug',
        'HTML': 'html',
        'markdown': 'markdown'
      };
      if (this.monaco) {
        monaco.editor.setModelLanguage(this.monaco.getModel(), formatLUT[language]);
      }
    }
  },
  mounted () {
    import('monaco-editor').then(monaco => {
      this.monaco = monaco.editor.create(this.$refs.monacoEditor, {
        fontSize: '12px',
        language: this.$props.language || '',
        folding: true,
        foldingStrategy: 'indentation',
        wordWrap: 'on',
        automaticLayout: true,
        overviewRulerBorder: true,
        scrollBeyondLastLine: true,
        minimap: {
          enabled: false
        },
        value: this.value
      });

      this.monaco.onDidBlurEditorText((e) => {
        this.$emit('input', this.monaco.getValue());
      });
    });
  },
  beforeDestroy () {
    if (this.monaco) {
      this.monaco.dispose();
    }
  },
  methods: {
    onPasteFile (event) {
      const pastedItems = [...event.clipboardData.items];
      console.log(event.clipboardData.files);

      for (const item of pastedItems) {
        const file = item.getAsFile();
        this.uploadFile(file, event.target);
      }
    },
    onDropFile (event) {
      event.preventDefault();
      event.stopPropagation();
      const files = [...event.dataTransfer.files];

      files.forEach(file => this.uploadFile(file, event.target));
    },
    async uploadFile (file, target) {
      if (!file) {
        return;
      }

      const comment = `<!-- UPLOAD PLACEHOLDER ID ${this.uploadId++} -->`;
      const editorBackendIsTextArea = !this.monaco;
      let html = '';

      if (editorBackendIsTextArea) {
        target.setRangeText(comment);
      } else {
        const editor = this.monaco;
        const selection = editor.getSelection();
        const model = editor.getModel();

        editor.executeEdits('update-value', [{
          range: selection,
          text: comment,
          forceMoveMarkers: true
        }]);

        editor.setSelection(new window.monaco.Selection(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn + comment.length));
      }

      try {
        const response = await api.media.uploadFile({
          file,
          token: this.$store.state.token,
          convert: /\.(jpg|jpeg|png|webp|bmp)$/.test(file.name),
        });
        const filename = response.data.filename;

        if (/\.(jpg|jpeg|png|webp|bmp|svg)$/.test(filename)) {
          const alt = response.data.alternative;
          
          if (alt.jpeg || alt.webp) {
            const sources = [];
            
            alt.webp && sources.push(`  <source srcset="/api/media/${encodeURIComponent(alt.webp)}" type="image/webp">`);
            alt.jpeg && sources.push(`  <source srcset="/api/media/${encodeURIComponent(alt.jpeg)}" type="image/jpeg">`);

            html = `<picture>\n${sources.join('\n')}\n  <img src="/api/media/${encodeURIComponent(filename)}">\n</picture>`;
          } else {
            html = `<img src="/api/media/${encodeURIComponent(filename)}">`;
          }
        } else {
          html = `<a href="/api/media/${encodeURIComponent(filename)}">${file.name}</a>`;
        }
      } catch (ex) {
        console.error(ex);
      }

      if (editorBackendIsTextArea) {
        const begin = target.value.indexOf(comment);
        const end = begin + comment.length;
        
        target.setRangeText(html, begin, end);
        target.setSelectionRange(begin + html.length, begin + html.length);

        const event = document.createEvent('HTMLEvents');
        event.initEvent('input', false, true);

        this.$refs.textarea.forEach(el => {
          el.dispatchEvent(event);
        });
      } else {
        const editor = this.monaco;
        const value = editor.getValue();
        const position = editor.getModel().getPositionAt(value.indexOf(comment));
        editor.executeEdits('update-value', [{
          range: new window.monaco.Selection(position.lineNumber, position.column, position.lineNumber, position.column + comment.length),
          text: html,
          forceMoveMarkers: true
        }]);
        this.$emit('input', this.monaco.getValue());
      }
    }

  }
};
</script>

<style lang="scss" scoped>
div.monaco-editor {
  border: 1px solid #ccc;
  height: 600px;
}
</style>