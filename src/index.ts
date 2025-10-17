import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { imageIcon } from '@jupyterlab/ui-components';

import { requestAPI } from './handler';
import { ImageCaptionMainAreaWidget } from './widget';

/**
 * Initialization data for the myextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'myextension:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  requires: [ICommandPalette, ILauncher],
  activate: (
    app: JupyterFrontEnd,
    // Dependencies are passed in in the same order they're defined in
    // "requires" above:
    palette: ICommandPalette,
    launcher: ILauncher
  ) => {
    console.log('JupyterLab extension myextension is activated!');

    requestAPI<any>('hello')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The myextension server extension appears to be missing.\n${reason}`
        );
      });

    const command = 'image-caption:open';
    app.commands.addCommand(command, {
      execute: () => {
        const widget = new ImageCaptionMainAreaWidget();

        app.shell.add(widget, 'main');
      },
      icon: imageIcon,
      label: 'View a random image & caption'
    });

    // Add our command to the launcher and the command palette
    launcher.add({ command });
    palette.addItem({ command, category: 'Tutorial' });
  }
};

export default plugin;
