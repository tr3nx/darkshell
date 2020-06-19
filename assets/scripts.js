window.bus = new Vue();

const themes = ['ltblue', 'turquoise', 'red', 'ltgreen', 'tomato', 'darkblue', 'orange', 'yellow', 'pink', 'purple', 'ltgray', 'gray', 'dark'];

const charpool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
let randomChar = () => charpool[Math.floor(Math.random() * charpool.length)];
const randomString = (len) => Array.from(new Array(len)).map(v => randomChar()).join('');


let globe = {
	screen: {
		width: document.documentElement.clientWidth,
		height: document.documentElement.clientHeight
	}
};

let state = {
	taskbar: {
		applications: [],
		menuLabel: 'Menu'
	},
	contacts: [
		{
			id: 1,
			name: 'Sandbox Assistant',
			bio: '',
			notes: ''
		}
	],
	networks: [
		{
			id: 1,
			name: 'sandbox',
			label: 'sandbox',
			status: 'Online',
			connected: true,
			ping: 0,
			location: [51.094623, -75.758107],
			country: 'Canada'
		}
	],
	emails: [
		{
			from: "sandbox@domain.com",
			to: "you@domain.com",
			cc: [],
			timestamp: Math.round(Math.random() * 100000),
			subject: "Lorem ipsum",
			body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		}
	],
	windows: [
		{
			id: 42,
			name: 'terminal',
			label: 'Terminal',
			size: [400, 350],
			pos: [(globe.screen.width / 2) - 200, (globe.screen.height  / 2) - 175],
			minimized: false,
			maximized: false,
			focus: false,
			closed: false,
			dragging: false
		},
		// {
		// 	id: 123,
		// 	name: 'emails',
		// 	label: 'Emails',
		// 	size: [820, 320],
		// 	pos: [(globe.screen.width / 2) - 410, 520],
		// 	minimized: false,
		// 	maximized: false,
		// 	focus: false
		// },
		// {
		// 	id: 69,
		// 	name: 'networks',
		// 	label: 'Networks',
		// 	size: [400, 350],
		// 	pos: [(globe.screen.width / 2) + 10, 150],
		// 	minimized: false,
		// 	maximized: false,
		// 	focus: false,
		// 	closed: false,
		// 	dragging: false
		// },
		// {
		// 	id: 123,
		// 	name: 'irc',
		// 	label: '#freenode',
		// 	size: [350, 250],
		// 	pos: [(globe.screen.width / 2) + 10, globe.screen.height / 2 + 50],
		// 	minimized: false,
		// 	maximized: false,
		// 	focus: false,
		// 	closed: false,
		// 	dragging: false
		// },
		// {
		// 	id: 4321,
		// 	name: 'file-browser',
		// 	label: 'Files',
		// 	size: [400, 400],
		// 	pos: [(globe.screen.width / 2) + 10, 150],
		// 	minimized: false,
		// 	maximized: false,
		// 	focus: false,
		// 	closed: false,
		// 	dragging: false
		// }
	],
	filesystem: {
		'/home' : {
			files : [
				{
					filename: '/home/demo',
					isDir: true
				}
			]
		},
		'/home/demo' : {
			files : [
				{
					filename: 'demo.tar.gz',
					filesize: 15536,
					isDir: false
				}
			]
		}
	}
};

const story = {
	chapters : [
		{
			chapter: 1,
			name: "wakeup",
			label: "wake up...",
			actions: [
				[log, ['wake up...'], 2000],
				[log, ['i know you are out there'], 3000],
				[log, ['type something back']],
				// [receiveInput]
			]
		}
	]
};

async function storyTeller(chapters) {
	for (let chapter of chapters) {
		for (let action of chapter.actions) {
  			await performAction(action);
		}
	}
}

async function performAction(action) {
	return new Promise((resolve, reject) => setTimeout(() => resolve(action[0](...action[1])), (action[2] ? action[2] : 6000)));
}


function log(msg) { window.bus.$emit('stdout', msg); }

function receiveInput(expected) {
	// if (expected) {}
	// window.bus.$on('processPrompt', function(prompt) {
	// 	console.log(prompt);
	// });
}

// function createWindow(win) {
// 	state.windows.push(win);
// }

Vue.component('file-browser', {
	template: '#file-browser-template',
	data: function() {
		return {
			fields: [
				{
					schemaName: 'id',
					label: 'ID',
					sort: '',
				},
				{
					schemaName: 'filename',
					label: 'Filename',
					sort: ''
				},
				{
					schemaName: 'size',
					label: 'Size',
					sort: ''
				}
			],
			filesystem: state.filesystem,
			currentDirectory: '/home/atlas',
			files: []
		};
	},
	mounted: function() {
		let dir = this.filesystem[this.currentDirectory];
		if (dir) {
			this.files = dir.files;
		} else {
			log(`cannot access '${this.currentDirectory}': No such file or directory`);
		}
	},
	created: function() {

	},
	methods: {

	},
	watch: {
		files: function() {

		}
	}
});

Vue.component('desktop', {
	template: '#desktop-template',
	data: function() {
		return {
			icons: [
				{
					label: 'Terminal'
				},
				{
					label: 'Networks'
				},
				{
					label: 'Email'
				},
				{
					label: 'Files'
				}
			]
		};
	},
	created: function() {

	},
	mounted: function() {

	},
	methods: {
		desktopClick: function(e) {
			state.windows.forEach(w => { w.focus = false; });
		}
	}
});

Vue.component('terminal', {
	template: '#terminal-template',
	data: function() {
		return {
			queue: [],
			buffer: '',
			symbol: '$',
			prompt: '',
			history: []
		};
	},
	created: function() {
		window.bus.$on('stdout', this.handleIncoming);
	},
	beforeDestroy: function() {
		window.bus.$off('stdout', this.handleIncoming);
	},
	mounted: function() {
	},
	methods: {
		handleIncoming: function(incoming) {
			this.queue.push(incoming);
		},
		processQueue: function() {
			this.history.push({ buffer: this.queue.shift() });
		},
		processPrompt: function() {
			window.bus.$emit('processPrompt', this.prompt);
			this.queue.push(this.prompt);
			this.prompt = '';
		}
	},
	watch: {
		queue: function() {
			if (this.queue.length) {
				this.processQueue();
			}
		},
		history: function() {
			this.$nextTick(() => {
				this.$refs.outputs.scrollTop = this.$refs.outputs.scrollHeight;
			});
		}
	}
});

Vue.component('networks', {
	template: '#networks-template',
	data: function() {
		return {
			scanners: state.scanners,
			networks: state.networks
		};
	},
	mounted: function() {
		window.bus.$on('network-discovery', this.networkDiscovered);
	},
	beforeDestroy: function() {
		window.bus.$off('network-discovery', this.networkDiscovered);
	},
	watch: {
		scanners: function(n, o) {
			
		},
		discovered: function(n, o) {

		}
	},
	methods: {
		add: function(netid) {
			let t = this.scanners.filter(s => !s.assigned);
			if (t.length) {
				t[0].assigned = netid;
			}
		},
		remove: function(netid) {
			let t = this.scanners.filter(s => s.assigned === netid);
			if (t.length) {
				t[0].assigned = 0;
			}
		},
		assigned: function(netid) {
			return this.scanners.filter(s => s.assigned === netid).length;
		},
		unassigned: function() {
			return this.scanners.filter(s => !s.assigned).length;
		},
		networkDiscovered: function(net) {
			this.networks.push(net);
		},
		scannersRemoveAll: function() {
			this.scanners.forEach(s => {
				s.assigned = 0;
			});
		},
		networksAdd: function() {
			let r = Math.floor(Math.random() * 10000);
			window.bus.$emit('stdout', `[+] New network discovered... unknown ${r}`);
			this.networks.push({
				id: r,
				name: `unknown-${r}`,
				label: `Unknown ${r}`,
				status: 'Unknown',
				connected: false,
				ping: Math.floor(r / 12)
			});
		}
	}
});

Vue.component('emails', {
	template: '#emails-template',
	data: function() {
		return {
			reading: undefined,
			emails: state.emails
		};
	},
	mounted: function() {
		// window.bus.$on('emails-new-email', this.handleNewEmail);
	},
	beforeDestroy: function() {

	},
	methods: {
		read: function(email) {
			this.reading = email;
		}
	}
});

Vue.component('irc', {
	template: '#irc-template',
	data: function() {
		return {
			contacts: state.contacts
		};
	},
	methods: {

	}
});

Vue.component('login', {
	template: '#login-template',
	data: function() {
		return {
			username: '',
			password: ''
		};
	},
	methods: {
		loginClick: function() {
			log('[@] login');
		}
	}
});

Vue.component('window', {
	template: '#window-template',
	props: {
		id: Number,
		name: String,
		label: String,
		size: Array,
		pos: Array,
		focus: Boolean,
		dragging: Boolean,
		minimized: Boolean,
		maximized: Boolean,
		closed: Boolean
	},
	data: function() {
		return {
			prevSize: [],
			prevPos: []
		};
	},
	mounted: function() {
		this.$refs.label.addEventListener('mousedown', this.dragStart);
		this.$refs.label.addEventListener('dragstart', function() { return false; });

		this.$refs.resizebottom.addEventListener('mousedown', this.resizeDragStart);
		this.$refs.resizebottom.addEventListener('dragstart', function() { return false; });
	},
	beforeDestroy: function() {
		this.$refs.label.removeEventListener('mousedown', this.dragStart);
		this.$refs.label.removeEventListener('dragstart', function() { return false; });
	},
	methods: {
		minimize: function() {
			window.bus.$emit('window-minimize', this);
		},
		maximize: function() {
			window.bus.$emit('window-maximize', this);
		},
		close: function() {
			window.bus.$emit('window-close', this);
		},
		frameClick: function() {
			window.bus.$emit('window-focus', this);
		},
		handleFocus: function() {
			let ins = this.$el.getElementsByTagName('input');
			if (ins.length && this.focus) {
				ins[0].focus();
			} else if (ins.length && !this.focus) {
				ins[0].blur();
			}
		},
		dragStart: function(e) {
			this.shiftX = e.clientX - this.$el.getBoundingClientRect().left;
			this.shiftY = e.clientY - this.$el.getBoundingClientRect().top;

			this.$parent.$el.addEventListener('mousemove', this.dragMove);
			this.$parent.$el.addEventListener('mouseup', this.dragStop);

			window.bus.$emit('window-focus', this);
		},
		dragMove: function(e) {
			window.bus.$emit('window-drag', { win: this, pos: [e.pageX - this.shiftX, e.pageY - this.shiftY] });
		},
		dragStop: function(e) {
			this.$parent.$el.removeEventListener('mousemove', this.dragMove);
			this.$parent.$el.removeEventListener('mouseup', this.dragStop);
			this.$refs.label.onmouseup = null;
			this.shiftX = this.shiftY = 0;

			window.bus.$emit('window-drop', { win: this });
		},
		resizeDragStart: function(e) {
			this.shiftX = e.clientX;
			this.shiftY = e.clientY;

			this.$parent.$el.addEventListener('mousemove', this.resizeDragMove);
			this.$parent.$el.addEventListener('mouseup', this.resizeDragStop);

			window.bus.$emit('window-focus', this);
		},
		resizeDragMove: function(e) {
			window.bus.$emit('window-resize-drag', { win: this, amount: e.pageY - this.shiftY - this.pos[1] + 2 });
			this.shiftY = 0;
		},
		resizeDragStop: function(e) {
			this.$parent.$el.removeEventListener('mousemove', this.resizeDragMove);
			this.$parent.$el.removeEventListener('mouseup', this.resizeDragStop);
			this.$refs.resizebottom.onmouseup = null;
			this.shiftY = 0;

			window.bus.$emit('window-resize-drop', { win: this });
		}
	},
	watch: {
		focus: function(n, o) {
			this.handleFocus();
		},
		size: function(n, o) {
			this.prevSize = o;
		},
		pos: function(n, o) {
			this.prevPos = o;
		}
	},
	computed: {
		x: function() { return this.pos[0]; },
		y: function() { return this.pos[1]; },
		width: function() { return this.size[0]; },
		height: function() { return this.size[1]; },
		clientWidth: function() { return this.$el.clientWidth(); },
		clientHeight: function() { return this.$el.clientHeight(); },
		zindex: function() { return this.focus ? 2 : 1; },
		styleString: function() {
			return `width:${this.width}px;height:${this.height}px;left:${this.x}px;top:${this.y}px;z-index:${this.zindex};`;
		}
	}
});

Vue.component('taskbar', {
	template: '#taskbar-template',
	data: function() {
		return {
			windows: state.windows,
			applications: state.taskbar.applications,
			menuLabel: state.taskbar.menuLabel,
			isMenuOpen: false
		};
	},
	methods: {
		menuClick: function() {
			this.isMenuOpen = !this.isMenuOpen;
		},
		taskClick: function(win) {
			if (win.minimized) {
				window.bus.$emit('window-raise', win);
			} else if (!win.focus) {
				window.bus.$emit('window-focus', win);
			}
		}
	}
});

Vue.component('window-manager', {
	template: '#window-manager-template',
	data: function() {
		return {
			width: 0,
			height: 0,
			focused: 0,
			prevFocused: 0,
			dragging: 0,
			gridInterval: 50,
			windows: state.windows
		};
	},
	mounted: function() {
		this.calculateDocumentSize();

		window.bus.$on('window-raise', this.windowRaise);
		window.bus.$on('window-focus', this.windowFocus);
		window.bus.$on('window-close', this.windowClose);
		window.bus.$on('window-minimize', this.windowMinimize);
		window.bus.$on('window-maximize', this.windowMaximize);
		window.bus.$on('window-drag', this.windowDrag);
		window.bus.$on('window-drop', this.windowDrop);
		window.bus.$on('window-resize-drag', this.windowResizeDrag);
		window.bus.$on('window-resize-drop', this.windowResizeDrop);
		window.addEventListener('resize', this.screenResize);
	},
	beforeDestroy: function() {
		window.bus.$off('window-raise', this.windowRaise);
		window.bus.$off('window-focus', this.windowFocus);
		window.bus.$off('window-close', this.windowClose);
		window.bus.$off('window-minimize', this.windowMinimize);
		window.bus.$off('window-maximize', this.windowMaximize);
		window.bus.$off('window-drag', this.windowDrag);
		window.bus.$off('window-drop', this.windowDrop);
		window.bus.$off('window-resize-drag', this.windowResizeDrag);
		window.bus.$off('window-resize-drop', this.windowResizeDrop);
		window.removeEventListener('resize', this.screenResize);
	},
	methods: {
		screenResize: function() {
			this.calculateDocumentSize();
			this.windowEdgeReposition();
		},
		calculateDocumentSize: function() {
			this.width = globe.screen.width = document.documentElement.clientWidth;
			this.height = globe.screen.height = document.documentElement.clientHeight;
		},
		windowMove: function(win, to) {
			win.pos = to;
		},
		windowEdgeReposition: function() {
			this.windows.forEach(w => {
				// x > window width
				if ((w.pos[0] + w.size[0]) > this.width) {
					w.pos = [w.pos[0] - ((w.pos[0] + w.size[0]) - this.width), w.pos[1]];
				}

				// y > window width
				if ((w.pos[1] + w.size[1]) > this.height) {
					w.pos = [w.pos[0], w.pos[1] - ((w.pos[1] + w.size[1]) - this.height)];
				}

				// x < 0
				if (w.pos[0] < 0) {
					w.pos = [0, w.pos[1]];
				}

				// y < 0
				if (w.pos[1] < 0) {
					w.pos = [w.pos[0], 0];
				}
			});
		},
		windowRaise: function(win) {
			this.windows.forEach(w => {
				w.focus = (w.id === win.id);
				if (w.id === win.id) {
					w.minimized = false;
				}
			});
			this.focused = win.id;
		},
		windowFocus: function(win) {
			this.windows.forEach(w => { w.focus = (w.id === win.id); });
			this.focused = win.id;
		},
		windowClose: function(win) {
			this.windows.forEach(w => { if (w.id === win.id) { w.closed = true; } });
			this.windowResetFocus();
		},
		windowMinimize: function(win) {
			this.windows.forEach(w => {
				if (w.id === win.id) {
					w.focus = false;
					w.minimized = true;
				}
			});
			this.windowResetFocus();
		},
		windowMaximize: function(win) {
			this.windows.forEach(w => {
				w.focus = (w.id === win.id);
				if (w.id === win.id) {
					if (w.maximized) {
						w.maximized = false;
						w.pos = win.prevPos;
						w.size = win.prevSize;
					} else {
						w.maximized = true;
						w.pos = [0, 0];
						w.size = [this.width, this.height];
					}
				}
			});
			this.focused = win.id;
		},
		windowDrop: function(wp) {
			this.windows.forEach(w => {
				if (w.id === wp.win.id) {
					w.dragging = false;
				}
			});
			this.dragging = 0;
		},
		windowDrag: function(wp) {
			this.windows.forEach(w => {
				if (w.id === wp.win.id) {
					w.pos = wp.pos
					w.dragging = true;
				}
			});
			this.dragging = wp.win.id;
		},
		windowResetFocus: function() {
			let opens = this.windows.filter(w => !w.minimized);
			if (opens.length) {
				let prevs = opens.filter(w => w.id === this.prevFocused);
				if (prevs.length) {
					this.focused = this.prevFocused;
					prevs[0].focus = true;
				} else {
					this.focused = opens[0].id;
					opens[0].focus = true;
				}
			} else {
				this.windows.forEach(w => w.focus = false);
				this.focused = 0;
			}
		},
		windowResizeDrag: function(wp) {
			this.windows.forEach(w => {
				if (w.id === wp.win.id) {
					w.size = [w.size[0], wp.amount];
					w.dragging = true;
				}
			});
			this.dragging = wp.win.id;
		},
		windowResizeDrop: function(wp) {
			this.windowDrop(wp);
		},
		_roundGridValue: function(n) {
			return Math.ceil((n + 1) / this.gridInterval) * this.gridInterval;
		}
	},
	watch : {
		focused: function(n, o) {
			this.prevFocused = o;
		}
	}
});

const darkshell = new Vue({
	el: '#screen',
	data: {
		theme: 'gray' // themes[Math.floor(Math.random() * themes.length)],
	},
	created: function() {
	},
	mounted: function() {
		storyTeller(story.chapters);
	}
});
