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
  (text_style_value)
  (line_style_value)
 ] @keyword
"inherit" @keyword

(feature_name) @keyword

[
  (url_image "url")
  (gradient_image "linear-gradient")
  (distance_calc "calc")
 ] @function.builtin

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

[
  (global_selector)
  (id_selector)
 ] @namespace

(id_selector_view [ "normal" "selected" "alternate" ] @property)
(id_selector_state [ "normal" "urgent" "active" ] @tag)

(ERROR) @error
