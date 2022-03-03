import _ from "lodash";

//cbp CookieBarPlugin，仅在这个模块中使用的assert
export function cbp_assert(value, msg) {
  if (process.env.NODE_ENV === "development") {
    if (!value) throw Error(msg || "assert error");
  }
}

export function cbp_getColorStringFromRGBAObj(rgba) {
  const { r, g, b, a } = rgba;
  cbp_assert(_.isObject(rgba), "rgba must be object");
  cbp_assert(
    _.isNumber(r) && _.isNumber(g) && _.isNumber(b) && _.isNumber(a),
    "must be number"
  );
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

//返回snake_obj
export function snakeObjFromObj(o) {
  const snake_obj = {};
  for (const key of _.keys(o)) {
    const snake_key = _.snakeCase(key);
    snake_obj[snake_key] = o[key];
  }
  return snake_obj;
}

//返回camelObj
export function camelObjFromObj(o) {
  const camelObj = {};
  for (const key of _.keys(o)) {
    const camelKey = _.camelCase(key);
    camelObj[camelKey] = o[key];
  }
  return camelObj;
}
