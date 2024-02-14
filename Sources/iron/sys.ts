
let _sys_render_listeners: (()=>void)[] = [];
let _sys_foreground_listeners: (()=>void)[] = [];
let _sys_resume_listeners: (()=>void)[] = [];
let _sys_pause_listeners: (()=>void)[] = [];
let _sys_background_listeners: (()=>void)[] = [];
let _sys_shutdown_listeners: (()=>void)[] = [];
let _sys_drop_files_listeners: ((s: string)=>void)[] = [];
let _sys_cut_listener: ()=>string = null;
let _sys_copy_listener: ()=>string = null;
let _sys_paste_listener: (data: string)=>void = null;

let _sys_start_time: f32;
let _sys_window_title: string;
let _sys_shaders: Map<string, shader_t> = new Map();

function sys_start(ops: kinc_sys_ops_t, callback: ()=>void) {
	krom_init(ops.title, ops.width, ops.height, ops.vsync, ops.mode, ops.features, ops.x, ops.y, ops.frequency);

	_sys_start_time = krom_get_time();
	g2_init();
	krom_set_update_callback(sys_render_callback);
	krom_set_drop_files_callback(sys_drop_files_callback);
	krom_set_cut_copy_paste_callback(sys_cut_callback, sys_copy_callback, sys_paste_callback);
	krom_set_application_state_callback(sys_foreground_callback, sys_resume_callback, sys_pause_callback, sys_background_callback, sys_shutdown_callback);
	krom_set_keyboard_down_callback(sys_keyboard_down_callback);
	krom_set_keyboard_up_callback(sys_keyboard_up_callback);
	krom_set_keyboard_press_callback(sys_keyboard_press_callback);
	krom_set_mouse_down_callback(sys_mouse_down_callback);
	krom_set_mouse_up_callback(sys_mouse_up_callback);
	krom_set_mouse_move_callback(sys_mouse_move_callback);
	krom_set_mouse_wheel_callback(sys_mouse_wheel_callback);
	krom_set_touch_down_callback(sys_touch_down_callback);
	krom_set_touch_up_callback(sys_touch_up_callback);
	krom_set_touch_move_callback(sys_touch_move_callback);
	krom_set_pen_down_callback(sys_pen_down_callback);
	krom_set_pen_up_callback(sys_pen_up_callback);
	krom_set_pen_move_callback(sys_pen_move_callback);
	krom_set_gamepad_axis_callback(sys_gamepad_axis_callback);
	krom_set_gamepad_button_callback(sys_gamepad_button_callback);
	input_register();

	callback();
}

function sys_notify_on_frames(listener: ()=>void) {
	_sys_render_listeners.push(listener);
}

function sys_notify_on_app_state(on_foreground: ()=>void, on_resume: ()=>void, on_pause: ()=>void, on_background: ()=>void, on_shutdown: ()=>void) {
	if (on_foreground != null) {
		_sys_foreground_listeners.push(on_foreground);
	}
	if (on_resume != null) {
		_sys_resume_listeners.push(on_resume);
	}
	if (on_pause != null) {
		_sys_pause_listeners.push(on_pause);
	}
	if (on_background != null) {
		_sys_background_listeners.push(on_background);
	}
	if (on_shutdown != null) {
		_sys_shutdown_listeners.push(on_shutdown);
	}
}

function sys_notify_on_drop_files(dropFilesListener: (s: string)=>void) {
	_sys_drop_files_listeners.push(dropFilesListener);
}

function sys_notify_on_cut_copy_paste(on_cut: ()=>string, on_copy: ()=>string, on_paste: (data: string)=>void) {
	_sys_cut_listener = on_cut;
	_sys_copy_listener = on_copy;
	_sys_paste_listener = on_paste;
}

function sys_foreground() {
	for (let listener of _sys_foreground_listeners) {
		listener();
	}
}

function sys_resume() {
	for (let listener of _sys_resume_listeners) {
		listener();
	}
}

function sys_pause() {
	for (let listener of _sys_pause_listeners) {
		listener();
	}
}

function sys_background() {
	for (let listener of _sys_background_listeners) {
		listener();
	}
}

function sys_shutdown() {
	for (let listener of _sys_shutdown_listeners) {
		listener();
	}
}

function sys_drop_files(file_path: string) {
	for (let listener of _sys_drop_files_listeners) {
		listener(file_path);
	}
}

function sys_time(): f32 {
	return krom_get_time() - _sys_start_time;
}

function sys_system_id(): string {
	return krom_system_id();
}

function sys_language(): string {
	return krom_language();
}

function sys_stop() {
	krom_request_shutdown();
}

function sys_load_url(url: string) {
	krom_load_url(url);
}

function sys_render_callback() {
	for (let listener of _sys_render_listeners) {
		listener();
	}
}

function sys_drop_files_callback(file_path: string) {
	sys_drop_files(file_path);
}

function sys_copy_callback(): string {
	if (_sys_copy_listener != null) {
		return _sys_copy_listener();
	}
	return null;
}

function sys_cut_callback(): string {
	if (_sys_cut_listener != null) {
		return _sys_cut_listener();
	}
	return null;
}

function sys_paste_callback(data: string) {
	if (_sys_paste_listener != null) {
		_sys_paste_listener(data);
	}
}

function sys_foreground_callback() {
	sys_foreground();
}

function sys_resume_callback() {
	sys_resume();
}

function sys_pause_callback() {
	sys_pause();
}

function sys_background_callback() {
	sys_background();
}

function sys_shutdown_callback() {
	sys_shutdown();
}

function sys_keyboard_down_callback(code: i32) {
	keyboard_down_listener(code);
}

function sys_keyboard_up_callback(code: i32) {
	keyboard_up_listener(code);
}

function sys_keyboard_press_callback(charCode: i32) {
	keyboard_press_listener(String.fromCharCode(charCode));
}

function sys_mouse_down_callback(button: i32, x: i32, y: i32) {
	mouse_down_listener(button, x, y);
}

function sys_mouse_up_callback(button: i32, x: i32, y: i32) {
	mouse_up_listener(button, x, y);
}

function sys_mouse_move_callback(x: i32, y: i32, mx: i32, my: i32) {
	mouse_move_listener(x, y, mx, my);
}

function sys_mouse_wheel_callback(delta: i32) {
	mouse_wheel_listener(delta);
}

function sys_touch_down_callback(index: i32, x: i32, y: i32) {
	///if (krom_android || krom_ios)
	mouse_on_touch_down(index, x, y);
	///end
}

function sys_touch_up_callback(index: i32, x: i32, y: i32) {
	///if (krom_android || krom_ios)
	mouse_on_touch_up(index, x, y);
	///end
}

function sys_touch_move_callback(index: i32, x: i32, y: i32) {
	///if (krom_android || krom_ios)
	mouse_on_touch_move(index, x, y);
	///end
}

function sys_pen_down_callback(x: i32, y: i32, pressure: f32) {
	pen_down_listener(x, y, pressure);
}

function sys_pen_up_callback(x: i32, y: i32, pressure: f32) {
	pen_up_listener(x, y, pressure);
}

function sys_pen_move_callback(x: i32, y: i32, pressure: f32) {
	pen_move_listener(x, y, pressure);
}

function sys_gamepad_axis_callback(gamepad: i32, axis: i32, value: f32) {
	gamepad_axis_listener(gamepad, axis, value);
}

function sys_gamepad_button_callback(gamepad: i32, button: i32, value: f32) {
	gamepad_button_listener(gamepad, button, value);
}

function sys_lock_mouse() {
	if (!sys_is_mouse_locked()) {
		krom_lock_mouse();
	}
}

function sys_unlock_mouse() {
	if (sys_is_mouse_locked()) {
		krom_unlock_mouse();
	}
}

function sys_can_lock_mouse(): bool {
	return krom_can_lock_mouse();
}

function sys_is_mouse_locked(): bool {
	return krom_is_mouse_locked();
}

function sys_hide_system_cursor() {
	krom_show_mouse(false);
}

function sys_show_system_cursor() {
	krom_show_mouse(true);
}

function sys_resize(width: i32, height: i32) {
	krom_resize_window(width, height);
}

function sys_move(x: i32, y: i32) {
	krom_move_window(x, y);
}

function sys_x(): i32 {
	return krom_window_x();
}

function sys_y(): i32 {
	return krom_window_y();
}

function sys_width(): i32 {
	return krom_window_width();
}

function sys_height(): i32 {
	return krom_window_height();
}

function sys_mode(): window_mode_t {
	return krom_get_window_mode();
}

function sys_mode_set(mode: window_mode_t) {
	krom_set_window_mode(mode);
}

function sys_title(): string {
	return _sys_window_title;
}

function sys_title_set(value: string) {
	krom_set_window_title(value);
	_sys_window_title = value;
}

function sys_display_primary_id(): i32 {
	for (let i: i32 = 0; i < krom_display_count(); ++i) {
		if (krom_display_is_primary(i)) {
			return i;
		}
	}
	return 0;
}

function sys_display_width(): i32 {
	return krom_display_width(sys_display_primary_id());
}

function sys_display_height(): i32 {
	return krom_display_height(sys_display_primary_id());
}

function sys_display_frequency(): i32 {
	return krom_display_frequency(sys_display_primary_id());
}

function sys_buffer_to_string(b: ArrayBuffer): string {
	let str: string = "";
	let u8a: Uint8Array = new Uint8Array(b);
	for (let i: i32 = 0; i < u8a.length; ++i) {
		str += String.fromCharCode(u8a[i]);
	}
	return str;
}

function sys_string_to_buffer(str: string): ArrayBuffer {
	let u8a: Uint8Array = new Uint8Array(str.length);
	for (let i: i32 = 0; i < str.length; ++i) {
		u8a[i] = str.charCodeAt(i);
	}
	return u8a.buffer;
}

function sys_shader_ext(): string {
	///if krom_vulkan
	return ".spirv";
	///elseif (krom_android || krom_wasm)
	return ".essl";
	///elseif krom_opengl
	return ".glsl";
	///elseif krom_metal
	return ".metal";
	///else
	return ".d3d11";
	///end
}

function sys_get_shader_buffer(name: string): ArrayBuffer {
	///if arm_shader_embed
	let global: any = globalThis;
	return global["data/" + name + sys_shader_ext()];
	///else
	return krom_load_blob("data/" + name + sys_shader_ext());
	///end
}

function sys_get_shader(name: string): shader_t {
	let shader: shader_t = _sys_shaders.get(name);
	if (shader == null) {
		shader = g4_shader_create(
			sys_get_shader_buffer(name),
			name.endsWith(".frag") ? shader_type_t.FRAGMENT : name.endsWith(".vert") ? shader_type_t.VERTEX : shader_type_t.GEOMETRY);
		_sys_shaders.set(name, shader);
	}
	return shader;
}

function video_unload(self: video_t) {}

function sound_create(sound_: any): sound_t {
	let raw: sound_t = {};
	raw.sound_ = sound_;
	return raw;
}

function sound_unload(raw: sound_t) {
	krom_unload_sound(raw.sound_);
}

type Color = i32;

type video_t = {
	video_?: any;
};

type sound_t = {
	sound_?: any;
};

type kinc_sys_ops_t = {
	title: string;
	x: i32;
	y: i32;
	width: i32;
	height: i32;
	features: window_features_t;
	mode: window_mode_t;
	frequency: i32;
	vsync: bool;
};

enum window_features_t {
    NONE = 0,
    RESIZABLE = 1,
    MINIMIZABLE = 2,
    MAXIMIZABLE = 4,
}

enum window_mode_t {
	WINDOWED,
	FULLSCREEN,
}
