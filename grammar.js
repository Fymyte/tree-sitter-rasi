module.exports = grammar({
  name: 'rasi',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  inline: $ => [
    $._top_level_item,
  ],

  word: $ => $.identifier,

  rules: {
    stylesheet: $ => repeat($._top_level_item),

    _top_level_item: $ => choice(
      $.rule_set,
      $.import_statement,
      $.theme_statement,
      $.media_statement,
    ),

    // Statements

    import_statement: $ => seq(
      '@import',
      field('file', $.string_value),
    ),

    theme_statement: $ => seq(
      '@theme',
      field('file', $.string_value),
    ),

    media_statement: $ => seq(
      '@media',
      field('conditions', sep1(',', $._query)),
      field('body', $.block),
    ),

    // Rule sets

    rule_set: $ => seq(
      field('selectors', $.selectors),
      field('body', $.block),
    ),

    selectors: $ => sep1(',', $._selector),

    block: $ => seq('{',
      repeat($._block_item),
      '}'
    ),

    _block_item: $ => choice(
      $.declaration,
      $.rule_set,
    ),

    // Selectors

    _selector: $ => choice(
      $.id_selector,
      $.global_selector,
    ),

    global_selector: $ => '*',

    id_selector: $ => seq(
      optional('#'),
      field('widget', $.identifier),
      optional(field('view', $.id_selector_view)),
    ),

    id_selector_view: $ => seq(
      optional('.'),
      field('view', choice(
        'normal',
        'selected',
        'alternate',
      )),
      optional(field('state', $.id_selector_state)),
    ),

    id_selector_state: $ => seq(
      optional('.'),
      field('state', choice(
        'normal',
        'urgent',
        'active',
      )),
    ),

    // Declarations

    declaration: $ => seq(
      alias($.identifier, $.property_name),
      ':',
      field('value', $._value),
      repeat(seq(
        optional(','),
        field('value', $._value),
      )),
      ';',
    ),

    // Media queries

    _query: $ => choice(
      $.feature_query,
      $.parenthesized_query,
    ),

    feature_query: $ => seq(
      '(',
      field('key', $.feature_name),
      ':',
      field('value', repeat1($._value)),
      ')',
    ),

    parenthesized_query: $ => seq(
      '(',
      $._query,
      ')',
    ),

    feature_name: $ => choice(
      'min-width',
      'max-width',
      'min-height',
      'max-height',
      'min-aspect-ratio',
      'max-aspect-ratio',
      'monitor-id',
    ),

    // Property values

    _value: $ => prec(-1, choice(
      $.string_value,
      $.integer_value,
      $.float_value,
      $.boolean_value,
      $.image_value,
      $._color_value,
      $.text_style_value,
      $.line_style_value,
      $.distance_value,
      $.padding_value,
      $.border_value,
      $.position_value,
      $.reference_value,
      $.orientation_value,
      $.cursor_value,
      $.list_value,
      $.environ_value,
      'inherit',
    )),

    string_value: $ => seq('"', /([^"\n]|\\(.|\n))*/, '"'),

    integer_value: $ => token(seq(
      optional(choice('+', '-')),
      /\d+/
    )),

    float_value: $ => token(seq(
      optional(choice('+', '-')),
      /\d*/,
      seq('.', /\d+/),
    )),

    boolean_value: $ => choice(
      'true',
      'false',
    ),

    image_value: $ => choice(
      $.url_image,
      $.gradient_image,
    ),

    url_image: $ => seq(
      'url',
      '(',
      field('filename', $.string_value),
      optional(seq(',', field('scale', $.url_image_scale))),
      ')',
    ),

    url_image_scale: $ => choice(
      'none',
      'both',
      'width',
      'height',
    ),

    gradient_image: $ => seq(
      'linear-gradient',
      '(',
      optional(seq(
        choice(
          seq('to', alias($.gradient_image_dir, $.direction)),
          $.angle,
        ),
        ',',
      )),
      $._color_value,
      ',',
      sep1(',', $._color_value),
      ')',
    ),

    gradient_image_dir: $ => choice(
      'top',
      'left',
      'right',
      'bottom',
    ),

    angle: $ => seq(
      field('value', $.integer_value),
      field('unit', optional($.angle_unit)),
    ),

    angle_unit: $ => choice(
      'deg',
      'rad',
      'grad',
      'turn',
    ),

    _color_value: $ => choice(
      $.hex_color,
      $.rgb_color,
      $.hsl_color,
      $.hwb_color,
      $.cmyk_color,
      $.named_color,
    ),

    hex_color: $ => seq(
      '#',
      token.immediate(choice(
        /[0-9a-fA-F]{3,4}/,
        /[0-9a-fA-F]{6}/,
        /[0-9a-fA-F]{8}/,
      )),
    ),

    percentage: $ => choice(
      seq('0', optional('%')),
      seq(choice($.integer_value, $.float_value), '%'),
    ),

    rgb_color: $ => seq(
      choice('rgb', 'rgba'), '(',
      $.integer_value, ',',
      $.integer_value, ',',
      $.integer_value,
      optional(seq(',', $.percentage)),
      ')',
    ),

    hsl_color: $ => seq(
      choice('hsl', 'hsla'), '(',
      $.angle, ',', 
      $.percentage, ',', 
      $.percentage, 
      optional(seq(',', $.percentage)),
      ')',
    ),

    hwb_color: $ => seq(
      choice('hwb', 'hwba'), '(',
      $.angle, ',', 
      $.percentage, ',', 
      $.percentage, 
      optional(seq(',', $.percentage)),
      ')',
    ),

    cmyk_color: $ => seq(
      'cmyk', '(',
      $.percentage, ',', 
      $.percentage, ',', 
      $.percentage, ',',
      $.percentage, 
      optional(seq(',', $.percentage)),
      ')',
    ),

    named_color: $ => seq(
      field('name', $.identifier),
      optional(field('opacity', seq('/', $.percentage))),
    ),

    text_style_value: $ => choice(
      'bold',
      'italic',
      'underline',
      'strikethrough',
    ),

    line_style_value: $ => choice(
      'dash',
      'solid',
    ),

    distance_value: $ => choice(
      seq('0', optional(choice($.integer_distance_unit, $.float_distance_unit))),
      seq(field('value', $.integer_value), field('unit', $.integer_distance_unit)),
      seq(
        field('value', choice($.integer_value, $.float_value)),
        field('unit', $.float_distance_unit)
      ),
      $.distance_calc,
    ),

    distance_calc: $ => seq('calc', '(', sep1(field('op', $.distance_op), $.distance_value), ')'),

    distance_op: $ => choice(
        '+',
        '-',
        '*',
        '/',
        'modulo',
        'min',
        'max',
        'floor',
        'ceil',
        'round'
    ),

    distance_bin_expr: $ => prec.left(seq(
      field('left', $.distance_value),
      choice('+', '-', '*', '/'),
      field('right', $.distance_value),
    )),

    integer_distance_unit: $ => choice(
      'px',
      'mm',
    ),

    float_distance_unit: $ => choice(
      'cm',
      'ph',
      'em',
      '%'
    ),

    padding_value: $ => prec.right(seq(
      $.distance_value,
      $.distance_value,
      optional(seq(
        $.distance_value,
        optional($.distance_value),
      )),
    )),

    border_value: $ => prec.right(seq(
      $.first_border_style,
      optional(seq(
        $.border_style,
        optional(seq(
          $.border_style,
          optional($.border_style),
        )),
      )),
    )),

    first_border_style: $ => seq(
      field('size', $.distance_value),
      field('style', $.line_style_value),
    ),

    border_style: $ => prec.right(seq(
      field('size', $.distance_value),
      optional(field('style', $.line_style_value)),
    )),

    position_value: $ => prec.right(repeat1(choice(
      'center',
      'north',
      'east',
      'south',
      'west',
    ))),

    reference_value: $ => choice(
      seq('@', field('name', $.identifier)),
      seq('var', '(', field('name', $.identifier), optional(seq(',', field('value', $._value))), ')'),
    ),

    orientation_value: $ => choice(
      'horizontal',
      'vertical',
    ),

    cursor_value: $ => choice(
      'default',
      'pointer',
      'text',
    ),

    list_value: $ => seq(
      '[',
      sep(',', field('value', $.identifier)),
      ']',
    ),

    environ_value: $ => choice(
      seq('$', token.immediate('{'), field('name', $.identifier), '}' ),
      seq('env', '(', field('name', $.identifier), ',', field('value', $._value), ')'),
    ),

    identifier: $ => /[a-zA-Z][a-zA-Z0-9-_]*/,

    comment: $ => token(choice(
      seq('//', /(\\(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    )),
  }
})

function sep (separator, rule) {
  return optional(sep1(separator, rule))
}

function sep1 (separator, rule) {
  return seq(rule, repeat(seq(separator, rule)))
}
