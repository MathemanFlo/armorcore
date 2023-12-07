package kha;

import js.lib.Float32Array;
import kha.IndexBuffer;
import kha.PipelineState;
import kha.VertexBuffer;
import kha.Image;
import iron.math.Mat3;
import iron.math.Mat4;
import iron.math.Vec2;
import iron.math.Vec3;
import iron.math.Vec4;

class Graphics4 {
	private var renderTarget: kha.Image;

	public function new(renderTarget: kha.Image = null) {
		this.renderTarget = renderTarget;
	}

	public function begin(additionalRenderTargets: Array<kha.Image> = null): Void {
		Krom.begin(renderTarget, additionalRenderTargets);
	}

	public function end(): Void {
		Krom.end();
	}

	public function clear(?color: Color, ?depth: Float, ?stencil: Int): Void {
		var flags: Int = 0;
		if (color != null) flags |= 1;
		if (depth != null) flags |= 2;
		if (stencil != null) flags |= 4;
		Krom.clear(flags, color == null ? 0 : color.value, depth, stencil);
	}

	public function viewport(x: Int, y: Int, width: Int, height: Int): Void {
		Krom.viewport(x, y, width, height);
	}

	public function setVertexBuffer(vertexBuffer: kha.VertexBuffer): Void {
		vertexBuffer.set();
	}

	public function setVertexBuffers(vertexBuffers: Array<kha.VertexBuffer>): Void {
		Krom.setVertexBuffers(vertexBuffers);
	}

	public function setIndexBuffer(indexBuffer: kha.IndexBuffer): Void {
		indexBuffer.set();
	}

	public function setTexture(unit: TextureUnit, texture: kha.Image): Void {
		if (texture == null) return;
		texture.texture_ != null ? Krom.setTexture(unit, texture.texture_) : Krom.setRenderTarget(unit, texture.renderTarget_);
	}

	public function setTextureDepth(unit: TextureUnit, texture: kha.Image): Void {
		if (texture == null) return;
		Krom.setTextureDepth(unit, texture.renderTarget_);
	}

	public function setImageTexture(unit: TextureUnit, texture: kha.Image): Void {
		if (texture == null) return;
		Krom.setImageTexture(unit, texture.texture_);
	}

	public function setTextureParameters(texunit: TextureUnit, uAddressing: TextureAddressing, vAddressing: TextureAddressing, minificationFilter: TextureFilter, magnificationFilter: TextureFilter, mipmapFilter: MipMapFilter): Void {
		Krom.setTextureParameters(texunit, uAddressing, vAddressing, minificationFilter, magnificationFilter, mipmapFilter);
	}

	public function setTexture3DParameters(texunit: TextureUnit, uAddressing: TextureAddressing, vAddressing: TextureAddressing, wAddressing: TextureAddressing, minificationFilter: TextureFilter, magnificationFilter: TextureFilter, mipmapFilter: MipMapFilter): Void {
		Krom.setTexture3DParameters(texunit, uAddressing, vAddressing, wAddressing, minificationFilter, magnificationFilter, mipmapFilter);
	}

	public function setPipeline(pipeline: PipelineState): Void {
		pipeline.set();
	}

	public function setBool(location: ConstantLocation, value: Bool): Void {
		Krom.setBool(location, value);
	}

	public function setInt(location: ConstantLocation, value: Int): Void {
		Krom.setInt(location, value);
	}

	public function setFloat(location: ConstantLocation, value: Float): Void {
		Krom.setFloat(location, value);
	}

	public function setFloat2(location: ConstantLocation, value1: Float, value2: Float): Void {
		Krom.setFloat2(location, value1, value2);
	}

	public function setFloat3(location: ConstantLocation, value1: Float, value2: Float, value3: Float): Void {
		Krom.setFloat3(location, value1, value2, value3);
	}

	public function setFloat4(location: ConstantLocation, value1: Float, value2: Float, value3: Float, value4: Float): Void {
		Krom.setFloat4(location, value1, value2, value3, value4);
	}

	public function setFloats(location: ConstantLocation, values: Float32Array): Void {
		Krom.setFloats(location, values.buffer);
	}

	public function setVector2(location: ConstantLocation, value: Vec2): Void {
		Krom.setFloat2(location, value.x, value.y);
	}

	public function setVector3(location: ConstantLocation, value: Vec3): Void {
		Krom.setFloat3(location, value.x, value.y, value.z);
	}

	public function setVector4(location: ConstantLocation, value: Vec4): Void {
		Krom.setFloat4(location, value.x, value.y, value.z, value.w);
	}

	static var mat = new js.lib.Float32Array(16);
	public inline function setMatrix(location: ConstantLocation, matrix: Mat4): Void {
		mat[0] = matrix._00; mat[1] = matrix._01; mat[2] = matrix._02; mat[3] = matrix._03;
		mat[4] = matrix._10; mat[5] = matrix._11; mat[6] = matrix._12; mat[7] = matrix._13;
		mat[8] = matrix._20; mat[9] = matrix._21; mat[10] = matrix._22; mat[11] = matrix._23;
		mat[12] = matrix._30; mat[13] = matrix._31; mat[14] = matrix._32; mat[15] = matrix._33;
		Krom.setMatrix(location, mat.buffer);
	}

	public inline function setMatrix3(location: ConstantLocation, matrix: Mat3): Void {
		mat[0] = matrix._00; mat[1] = matrix._01; mat[2] = matrix._02;
		mat[3] = matrix._10; mat[4] = matrix._11; mat[5] = matrix._12;
		mat[6] = matrix._20; mat[7] = matrix._21; mat[8] = matrix._22;
		Krom.setMatrix3(location, mat.buffer);
	}

	public function drawIndexedVertices(start: Int = 0, count: Int = -1): Void {
		Krom.drawIndexedVertices(start, count);
	}

	public function drawIndexedVerticesInstanced(instanceCount: Int, start: Int = 0, count: Int = -1): Void {
		Krom.drawIndexedVerticesInstanced(instanceCount, start, count);
	}

	public function scissor(x: Int, y: Int, width: Int, height: Int): Void {
		Krom.scissor(x, y, width, height);
	}

	public function disableScissor(): Void {
		Krom.disableScissor();
	}
}

@:enum abstract TextureFilter(Int) to Int {
	var PointFilter = 0;
	var LinearFilter = 1;
	var AnisotropicFilter = 2;
}

@:enum abstract MipMapFilter(Int) to Int {
	var NoMipFilter = 0;
	var PointMipFilter = 1;
	var LinearMipFilter = 2; // linear texture filter + linear mip filter -> trilinear filter
}

@:enum abstract TextureAddressing(Int) to Int {
	var Repeat = 0;
	var Mirror = 1;
	var Clamp = 2;
}

@:enum abstract Usage(Int) to Int {
	var StaticUsage = 0;
	var DynamicUsage = 1; // Just calling it Dynamic causes problems in C++
	var ReadableUsage = 2;
}

typedef ConstantLocation = Dynamic;
typedef TextureUnit = Dynamic;
