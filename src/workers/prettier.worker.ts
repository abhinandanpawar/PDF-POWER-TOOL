import prettier from 'prettier/standalone';
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginHtml from "prettier/plugins/html";
import * as prettierPluginCss from "prettier/plugins/css";

self.onmessage = async (event) => {
  const {
    code,
    language
  } = event.data;

  try {
    let parser;
    let plugins;

    switch (language) {
      case 'javascript':
        parser = 'babel';
        plugins = [prettierPluginBabel, prettierPluginEstree];
        break;
      case 'json':
        parser = 'json';
        plugins = [prettierPluginBabel, prettierPluginEstree];
        break;
      case 'html':
        parser = 'html';
        plugins = [prettierPluginHtml];
        break;
      case 'css':
        parser = 'css';
        plugins = [prettierPluginCss];
        break;
      default:
        throw new Error(`Unsupported language for formatting: ${language}`);
    }

    const formattedCode = await prettier.format(code, {
      parser: parser,
      plugins: plugins,
      semi: true,
      singleQuote: true,
    });

    self.postMessage({
      formattedCode
    });
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
