(comment) @comment

"@media" @keyword
"@import" @include
"@theme" @include

(string_value) @string
[
  (integer_value)
  (float_value)
 ] @number
(boolean_value) @boolean

[
  (feature_name)
  (url_image_scale)
  (direction)
  (text_style_value)
  (line_style_value)
  (position_value)
  (orientation_value)
  (cursor_value)
  "inherit"
 ] @keyword


(url_image "url" @function.builtin)
(gradient_image "linear-gradient" @function.builtin)
(distance_calc "calc" @function.builtin)
(rgb_color ["rgb" "rgba"] @function.builtin)
(hsl_color ["hsl" "hsla"] @function.builtin)
(hwb_color ["hwb" "hwba"] @function.builtin)
(cmyk_color "cmyk" @function.builtin)

[
 "("
 ")"
 "{"
 "}"
 "["
 "]"
 ] @punctuation.bracket

(distance_op) @operator

[
 ";"
 ","
 ":"
 "."
 ] @punctuation.delimiter

[
 (angle_unit)
 (integer_distance_unit)
 (float_distance_unit)
 ] @type
(percentage) @number
(percentage "%" @type)

[
  (global_selector)
  (id_selector)
 ] @namespace

(id_selector_view [ "normal" "selected" "alternate" ] @property)
(id_selector_state [ "normal" "urgent" "active" ] @tag)

(hex_color) @number
(hex_color "#" @operator)
(named_color (identifier) @string.special)
(named_color "/" @operator)
(reference_value "@" @property (identifier) @type)
(reference_value "var" @function.builtin (identifier) @type)
(list_value (identifier) @type)
(environ_value "$" @property (identifier) @type)
(environ_value "env" @function.builtin (identifier) @type)

(property_name) @type

(ERROR) @error
