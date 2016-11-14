interface JQueryTerminalEchoOptions {
	/**
	 * it will allow to display raw html
	 */
	raw: boolean;

	/**
	 * callback function with one argument the div container
	 */
	finalize(div: HTMLElement) : void;

	/**
	 * default is true, if it's false it will not print echo text to terminal
	 * until you call flush method
	 */
	flush: boolean;

	/**
	 * it will not break text in the middle of the word (available from version
	 * 0.10.0).
	 */
	keepWords: boolean;
}

interface JQueryTerminalInterpreterOptions {
	/**
	 * default is "> " you can set it to string or function with one parameter
	 * which is callback that must be called with string for your prompt (you
	 * can use ajax call to get prompt from the server). You can use the same
	 * formatting as in echo.
	 */
	prompt?: string | (() => string);

	/**
	 * name is used if you want to distinguish two or more terminals on one
	 * page or on one server. (if name them differently they will have
	 * different history and authentication).
	 */
	name?: string;

	/**
	 * callback function called when you logout.
	 */
	onExit?(terminal: JQueryTerminal) : void;

	/**
	 * callback function called when you login.
	 */
	onStart?() : void;

	/**
	 * function called on keydown event if you return false it will not execute
	 * default actions (keydown event is use for the shortcuts).
	 */
	keydown?(event: Event, terminal: JQueryTerminal) : boolean;

	/**
	 * function with a callback that need to be executed with list of commands
	 * for tab completion (you need to pass array of commands to callback
	 * function), from version 0.8.0 you can also use true (it will act as
	 * tabcompletion option for objects and RPC as interpreter) or array if you
	 * know what your commands are and don't need to call ajax to get them.
	 */
	completion?: ((terminal: JQueryTerminal, command: string, callback: (values: string[]) => void) => void) | string[] | boolean;

	/**
	 * login can be function, string or boolean. Function must have 3 arguments
	 * login password and callback which must be called with token (if login
	 * and password match) or falsy value (if authentication fail). If
	 * interpreter is string with valid URI JSON-RPC service you can set login
	 * option to true (it will use login remote method) or name of RPC method.
	 * this in login function is terminal object.
	 */
	login?: ((user: string, password: string, callback: (token: string) => void) => void) | boolean | string;

	/**
	 * interpreter based mousewheel handler.
	 */
	mousewheel?: Function;
}

interface JQueryTerminalOptions {
	/**
	 * if false will not store your commands.
	 */
	history?: boolean;

	/**
	 * default is "> " you can set it to string or function with one parameter
	 * which is callback that must be called with string for your prompt (you
	 * can use ajax call to get prompt from the server). You can use the same
	 * formatting as in echo.
	 */
	prompt?: string | (() => string);

	/**
	 * name is used if you want to distinguish two or more terminals on one
	 * page or on one server. (if name them differently they will have
	 * different history and authentication).
	 */
	name?: string;

	/**
	 * default is set to JQuery Terminal Signature. You can set it to string
	 * or function (like prompt) with callback argument which must be called
	 * with your string.
	 */
	greetings?: string | ((callback: (text: string) => void) => void);

	/**
	 * if set to true it will process arguments when using an object (replace 
	 * regex with real regex object number with numbers and process escape 
	 * characters in double quoted strings - like \x1b \033 will be Escape for
	 * ANSI codes) - default true. If you pass function you can parse command
	 * line by yourself - it have one argument with string without name of the
	 * function and you need to return an array.
	 */
	processArguments?: boolean | ((arguments: string) => string[]);

	/**
	 * if non negative it will limit the printing lines on terminal. If set to
	 * 0 it will print only lines that fit on one page (it will not create
	 * scrollbar if it's enabled). Default -1 which disable the function.
	 */
	outputLimit?: number;

	/**
	 * if set to true it will add rel="noreferer" to all links crated by
	 * terminal (default false).
	 */
	linksNoReferer?: boolean;

	/**
	 * if this option is set to false it don't use CTRL+D to exit from
	 * terminal and don't include "exit" command, default is true.
	 */
	exit?: boolean;

	/**
	 * if this option is set to false it don't include "clear" command, default
	 * is true.
	 */
	clear?: boolean;

	/**
	 * login can be function, string or boolean. Function must have 3 arguments
	 * login password and callback which must be called with token (if login
	 * and password match) or falsy value (if authentication fail). If
	 * interpreter is string with valid URI JSON-RPC service you can set login
	 * option to true (it will use login remote method) or name of RPC method.
	 * this in login function is terminal object.
	 */
	login?: ((user: string, password: string, callback: (token: string) => void) => void) | boolean | string;

	/**
	 * function with a callback that need to be executed with list of commands
	 * for tab completion (you need to pass array of commands to callback
	 * function), from version 0.8.0 you can also use true (it will act as
	 * tabcompletion option for objects and RPC as interpreter) or array if you
	 * know what your commands are and don't need to call ajax to get them.
	 */
	completion?: ((terminal: JQueryTerminal, command: string, callback: (values: string[]) => void) => void) | string[] | boolean;

	/**
	 * default is true, if you want disable terminal you can set it to false.
	 * This is usefull if you want to hide terminal and enable on some action
	 * (If Terminal is enabled it intercept keyboard).
	 */
	enabled?: boolean;

	/**
	 * if set to true (by default) it will check number of arguments in
	 * functions and in JSON-RPC if service return system.describe (only 1.1
	 * draft say that it must return it, new Spec 2.0 don't say anything about
	 * it, json-rpc used by examples return system.describe).
	 */
	checkArity?: boolean;

	/**
	 * if set to true it will not use localStorage nor Cookies and save
	 * everything in memory only, default false.
	 */
	memory?: boolean;

	/**
	 * callback function called after initialization (if there is login
	 * function it will be called after authentication).
	 */
	onInit?(terminal: JQueryTerminal) :void;

	/**
	 * callback function that will be called instead of built in RPC error.
	 * (this in that function is terminal object).
	 */
	onRPCError?(error: any) : void;

	/**
	 * callback function called when you logout.
	 */
	onExit?(terminal: JQueryTerminal) : void;

	/**
	 * callback function called when clear command is executed.
	 */
	onClear?(terminal: JQueryTerminal) : void;

	/**
	 * callback function called when terminal get out of focus. If you return
	 * false in this callback function the terminal will not get out of focus.
	 */
	onBlur?(terminal: JQueryTerminal) : void;

	/**
	 * callback function called when terminal get resized.
	 */
	onResize?(terminal: JQueryTerminal) : void;

	/**
	 * callback function called when terminal get focus.
	 */
	onFocus?(terminal: JQueryTerminal) : void;

	/**
	 * callback function called when you switch to next terminal.
	 */
	onTerminalChange?(terminal: JQueryTerminal) : void;

	/**
	 * callback function called called before login.
	 */
	onBeforeLogin?(terminal: JQueryTerminal) : void;

	/**
	 * callback function that will be use with any result returned by JSON-RPC.
	 * So you can create better handler.
	 */
	processRPCResponse?(object: any) : void;

	/**
	 * event fired when command line is changed.
	 */
	onCommandChange?(command: string, terminal: JQueryTerminal) : void;

	/**
	 * callback that will be executed instead of default print exception on
	 * terminal.
	 */
	exceptionHandler?(exception: Error) : void;

	/**
	 * if you return false in this function command will not be added into
	 * history.
	 */
	historyFilter?(command: string) : boolean;

	/**
	 * if used it will not call system.describe metod for JSON-RPC (it was in
	 * version 1.1 of JSON-RPC which was a draft, but it's supported by JSON-
	 * RPC implementetion used in demos).
	 */
	ignoreSystemDescribe?: boolean;

	/**
	 * size of the history (default 60) if you pass falsy value it will be not
	 * restricted.
	 */
	historySize?: number;

	/**
	 * if set to true terminal will record all commands in url hash.
	 */
	historyState?: boolean;

	/**
	 * function called on keypress event if you return false it will not
	 * execute default actions (keypress event is called when you type
	 * printable characters).
	 */
	keypress?(event: Event, terminal: JQueryTerminal) : boolean;

	/**
	 * function called on keydown event if you return false it will not execute
	 * default actions (keydown event is use for the shortcuts).
	 */
	keydown?(event: Event, terminal: JQueryTerminal) : boolean;

	/**
	 * if set to true it will convert urls to a tags, it do that by default.
	 */
	convertLinks?: boolean;

	/**
	 * indicate if terminals should scroll to bottom on echo or flush.
	 */
	scrollOnEcho?: boolean;

	/**
	 * if set to true it will set noreferrer on links, default set to false.
	 */
	linksNoReferrer?: boolean;

	/**
	 * default mask character by default it's `*' (if set to true), used when
	 * you use set_mask(true).
	 */
	maskChar?: boolean | string;

	/**
	 * if set to true it will execute commands from url hash, the hash need to
	 * have a form of JSON array that look like this 
	 * 
	 * #[[0,1,"command"],[0,2,"command2"]]
	 * 
	 * first number is index of terminal on a page second is index of command
	 * for terminal. (0 is initial state of the terminal so first command have
	 * index of 1). Set to false by default.
	 */
	execHash?: boolean;

	/**
	 * callback function executed after the command.
	 */
	onAfterCommand?(command: string) : void;

	/**
	 * function executed before logout from main interpreter, if function
	 * return false terminal will not logout.
	 */
	onBeforeLogout?() : boolean;

	/**
	 * function executed after logout from the terminal if there was a login.
	 */
	onAfterLogout?() : void;

	/**
	 * function executed on JSON-RPC ajax error. (this in this function is
	 * terminal object).
	 */
	onAjaxError?(xhr: XMLHttpRequest, status: number, error: Error) : void;

	/**
	 * function executed before command. If function return false the command
	 * will not be executed.
	 */
	onBeforeCommand?(command: string) : boolean;

	/**
	 * function executed if there are no command with that name, by default
	 * terminal display error message, it will not work if you use function as
	 * interpreter.
	 */
	onCommandNotFound?(command: string, terminal: JQueryTerminal) : void;

	/**
	 * function executed when you call pause() or return a promise from a
	 * command.
	 */
	onPause?() : void;

	/**
	 * function executed when you call resume() or when promise returned in
	 * command is resolved.
	 */
	onResume?() : void;
}

interface JQueryTerminalHistory {
	append(item: any) : void;
	data() : any;
	reset() : void;
	last() : any;
	end() : boolean;
	position() : number;
	current() : any;
	next() : any;
	previous() : any;
	clear() : void;
	enabled() : boolean;
	enable() : void;
	purge() : void;
	disable() : void;
}

interface JQueryTerminalView {
	focus: boolean;
	mask: string;
	prompt: string;
	command: string;
	position: number;
	lines: string[];
	interpreters: ((command: string, terminal: JQueryTerminal) => void)[];
}

interface JQueryTerminal {
	/**
	 * clear terminal
	 */
	clear() : void;

	/**
	 * if your command will take some time to compute (like in AJAX call) you can
	 * pause terminal (terminal will be disable and command line will be hidden) 
	 * and resume it in AJAX response is called. (if you want proper timing when 
	 * call exec on array of commands you need to use those functions). From 
	 * version 0.11.1 pause accept optional boolean argument that indicate if 
	 * command line should be visible (this can be used with animation).
	 */
	pause(commandLineVisible?: boolean) : void;

	/**
	 * if your command will take some time to compute (like in AJAX call) you can
	 * pause terminal (terminal will be disable and command line will be hidden) 
	 * and resume it in AJAX response is called. (if you want proper timing when 
	 * call exec on array of commands you need to use those functions). From 
	 * version 0.11.1 pause accept optional boolean argument that indicate if 
	 * command line should be visible (this can be used with animation).
	 */
	resume() : void;

	/**
	 * return true if terminal is paused.
	 */
	paused() : boolean;

	/**
	 * display string on terminal — (additionally if you can call this function
	 * with a function as argument it will call that function and print the 
	 * result, this function will be called every time you resize the terminal 
	 * or browser).
	 * 
	 * From version 0.4.19 terminal support ANSI formatting like 
	 * \x1b[1;31mhello[0m will produce red color hello. Here is shorter 
	 * description of ansi escape codes.
	 * 
	 * From version 0.7.3 it also support Xterm 8bit (256) colors (you can test 
	 * using this GNU Head) and formatting output from man command (overtyping).
	 * 
	 * From version 0.8.0 it support html colors like blue, navy or red
	 * 
	 * From version 0.9.0 Ansi escape code require unix_formatting.js file.
	 */
	echo(message?: string | (() => string), options?: JQueryTerminalEchoOptions) : void;

	/**
	 * it display string in in red.
	 */
	error(message?: string | (() => string)) : void;

	/**
	 * display exception with stack trace on terminal (second paramter is 
	 * optional is used by terminal to show who throw the exception).
	 */
	exception(error: Error, label?: string) : void;

	/**
	 * return how deeply nested in interpreters you correctly in (It start from 1).
	 */
	level() : number;

	/**
	 * return index of last line that can be use with update method after you 
	 * echo something and you lost the reference using -1.
	 */
	last_index() : number;

	/**
	 * execute login function the same as login option but first argument need to
	 * be a function. The function will be called with 3 arguments, user, 
	 * password and a function that need to be called with truthy value that will
	 * be stored as token. Each interpreter can have it's own login function (you
	 * will need call push function and then login. The token will be stored 
	 * localy, you can get it passing true to token function. Second argument 
	 * indicate if terminal should ask for login and password infinitely.
	 */
	login(loginFunction?: (user: string, password: string, callback: (result: boolean) => void) => void, repeatAsking?: boolean) : void;

	/**
	 * Execute command that like you where type it into terminal (it will execute
	 * user defined function). Second argument is optional if set to true, it 
	 * will not display prompt and command that you execute. If you want to have
	 * proper timing of executed function when commands are asynchronous (use 
	 * ajax) then you need to call pause and resume (make sure that you call 
	 * pause before ajax call and resume as last in ajax response).
	 */
	exec(command?: string, echoOn?: boolean) : void;

	/**
	 * you can use this method to scroll manually terminal (you can pass positive
	 * or negative value).
	 */
	scroll(amount?: number) : void;

	/**
	 * if you use authentication it will logout from terminal. If you don't set 
	 * login option this function will throw exception.
	 */
	logout() : void;

	/**
	 * if you echo using option
	 * 
	 * flush: false
	 * 
	 * (it will not display text immediately) then you can send that text to the
	 * terminal output using this function.
	 */
	flush() : void;

	/**
	 * return token which was set in authentication process or by calling login
	 * function. This is set to null if there is no login option. If you pass 
	 * true as an argument you will have local token for the interpreter (created
	 * using push function) it will return null if that interpreter don't have
	 * token.
	 */
	token(localInterpreterToken?: boolean) : string;

	/**
	 * update token
	 */
	set_token(token?: string, localInterpreterToken?: boolean) : void;

	/**
	 * same as token()
	 */
	get_token(localInterpreterToken?: boolean) : string;

	/**
	 * return login name which was use in authentication. This is set to null if
	 * there is no login option.
	 */
	login_name() : string;

	/**
	 * if you have more then one terminal instance it will switch to next
	 * terminal (in order of creation) and return reference to that terminal.
	 */
	next() : void;

	/**
	 * returns number of characters of the terminal.
	 */
	cols() : number;

	/**
	 * returns number of lines of the terminal.
	 */
	rows() : number;

	/**
	 * return command line History object
	 */
	history() : JQueryTerminalHistory;

	/**
	 * return name of the interpreter
	 */
	name() : string;

	/**
	 * push next interpreter on the stack and call that interpreter. First 
	 * argument is new interpreter (the same as first argument to terminal)
	 */
	push(interpreterFunction?: (command: string, terminal: JQueryTerminal) => void, options?: JQueryTerminalInterpreterOptions) : void;

	/**
	 * remove current interpreter from the stack and run previous one.
	 */
	pop() : boolean | JQueryTerminal;

	/**
	 * it will activate next terminal if argument is false or disable previous
	 * terminal and activate current one. If you have only one terminal 
	 * instance it act the same as disable/enable.
	 */
	focus(disablePrevious?: boolean) : void;

	/**
	 * enables the terminal
	 */
	enable() : void;

	/**
	 * disables the terminal
	 */
	disable() : void;

	/**
	 * remove everything created by terminal. It will not touch local storage,
	 * if you want to remove it as weel use purge.
	 */
	destroy() : void;

	/**
	 * remove all local storage left by terminal. It will act like logout 
	 * because it will remove login and token from local storage but you will
	 * not be logout until you refresh the page.
	 */
	purge() : void;

	/**
	 * change size of terminal if is called with two arguments (width,height)
	 * it will resize using this values. If is called without arguments it will
	 * act like refresh and use current size of element (you can use this if 
	 * you set size in some other way).
	 */
	resize(width?: number, height?: number) : void;

	/**
	 * return JQuery Singature depending on size of terminal.
	 */
	signature() : string;

	/**
	 * return current command
	 */
	get_command() : string;

	/**
	 * insert text in cursor position.
	 */
	insert(text: string) : void;

	/**
	 * return object that can be use to restore the view using import_view.
	 */
	export_view() : JQueryTerminalView;

	/**
	 * restore the view of the terminal using object returned prevoiusly by
	 * export_view.
	 */
	import_view(view?: JQueryTerminalView) : void;

	/**
	 * set prompt
	 */
	set_prompt(prompt?: string | (() => string)) : void;

	/**
	 * get prompt
	 */
	get_prompt() : string;

	/**
	 * set command using string
	 */
	set_command(command: string) : void;

	/**
	 * toogle mask of command line if argument is true it will use maskChar as
	 * mask.
	 */
	set_mask(mask?: boolean | string) : void;

	/**
	 * return string contains whatever was print on terminal, if argument is
	 * set to true it will return raw lines data.
	 */
	get_output(rawLinesData?: boolean) : string;

	/**
	 * disable/enable terminal that can't be enabled by clicking on terminal
	 */
	freeze(freeze?: boolean) : void;

	/**
	 * check if terminal has been frozen by freeze command
	 */
	frozen() : boolean;

	/**
	 * wrapper over push, it set prompt to string and wait for text from user
	 * then call user function with entered string.
	 */
	read(prompt?: string | (() => string)) : void;

	/**
	 * autologin if you get username and token in other way, like in sysend
	 * event.
	 */
	autologin(username?: string, token?: string) : void;

	/**
	 * it save current state of the terminal and update the hash. If second 
	 * argument is true it will not update hash.
	 */
	save_state(command?: string, skipUpdateHash?: boolean) : void;

	/**
	 * disable or enable history state save in hash. You can create commads
	 * that will start or stop the recording of commands, the commands itself
	 * will not be recorded.
	 */
	history_state(enableHashSave?: boolean) : void;

	/**
	 * clear saved history state
	 */
	clear_history_state() : void;

	/**
	 * reinitialize the terminal
	 */
	reset() : void;

	/**
	 * update line with specified number with given string. The line number can
	 * be negative (-1 will change last line).
	 */
	update(line: number, content: string) : void;

	/**
	 * return name that is used for localStorage keys, if argument is true it
	 * will return name of local interpreter (added by push() method).
	 */
	prefix_name(localInterpreter?: boolean) : string;

	/**
	 * return reference to settings object that can change options dynamicaly.
	 * Note that not all options can be change that way, like history based
	 * options.
	 */
	settings() : JQueryTerminalOptions;

	/**
	 * overwrite current interpreter
	 */
	set_interpreter(interpreterFunction?: (command: string, terminal: JQueryTerminal) => void, loginToInterpreter?: boolean) : void;
}

interface JQuery {
	terminal(interpreterFunction: (command: string, terminal: JQueryTerminal) => void, options?: JQueryTerminalOptions) : JQueryTerminal;
}
