import BrowserWindow from 'browser-window'

export default class MainWindow
{
	constructor()
	{
		const windowProperty = 
		{
			width: 400,
			height: 800
		};
		const renderFilePath = "file://" + __dirname + "/../../renderer/main.html";

		this.window = new BrowserWindow(windowProperty);

		this.window.loadUrl(renderFilePath);

		this.window.on('closed', () =>
		{
			this.window = null;
		});
	}
}
