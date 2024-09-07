#include "iron_vec2.h"

#include <math.h>
#include <kinc/math/core.h>

vec2_t vec2_new(float x, float y) {
	vec2_t v;
	v.x = x;
	v.y = y;
	return v;
}

vec2_t vec2_create(float x, float y) {
	return vec2_new(x, y);
}

float vec2_len(vec2_t v) {
	return (float)sqrt(v.x * v.x + v.y * v.y);
}

vec2_t vec2_set_len(vec2_t v, float length) {
	float current_length = vec2_len(v);
	if (current_length == 0) {
		return v;
	}
	float mul = length / current_length;
	v.x *= mul;
	v.y *= mul;
	return v;
}

vec2_t vec2_sub(vec2_t a, vec2_t b) {
	a.x -= b.x;
	a.y -= b.y;
	return a;
}

vec2_t vec2_nan() {
	vec2_t v;
	v.x = NAN;
	return v;
}

bool vec2_isnan(vec2_t v) {
	return isnan(v.x);
}
