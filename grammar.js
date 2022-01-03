module.exports = grammar({
  name: 'rasi',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  inline: $ => [
    $._top_level_item,
  ],

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
      field('widget', $.identifier),
      optional(field('view', $.id_selector_view)),
    ),

    id_selector_view: $ => seq(
      optional('.'),
      choice(
        'normal',
        'selected',
        'alternate',
      ),
      optional(field('state', $.id_selector_state)),
    ),

    id_selector_state: $ => seq(
      optional('.'),
      choice(
        'normal',
        'urgent',
        'active',
      ),
    ),

    // Declarations

    declaration: $ => seq(
      alias($.identifier, $.property_name),
      ':',
      $._value,
      repeat(seq(
        optional(','),
        $._value
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
      $.color_value,
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
      $.string_value,
      optional(seq(',', $.url_image_scale)),
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
          alias($.gradient_image_dir, $.direction),
          $.angle,
        ),
        ',',
      )),
      $.color_value,
      ',',
      $.color_value,
      ',',
      sep1(',', $.color_value),
      ')',
    ),

    gradient_image_dir: $ => choice(
      'top',
      'left',
      'right',
      'bottom',
    ),

    angle: $ => seq(
      alias($.integer_value, $.angle),
      optional($.angle_unit),
    ),

    angle_unit: $ => choice(
      'deg',
      'rad',
      'grad',
      'turn',
    ),

    color_value: $ => choice(
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

    percentage: $ => seq(
      choice($.integer_value, $.float_value),
      '%',
    ),

    rgb_color: $ => seq(
      'rgb', optional(token.immediate('a')), '(',
      $.integer_value, ',',
      $.integer_value, ',',
      $.integer_value,
      optional(seq(',', $.percentage)),
      ')',
    ),

    hsl_color: $ => seq(
      'hsl', optional(token.immediate('a')), '(',
      $.angle, ',', 
      $.percentage, ',', 
      $.percentage, 
      optional(seq(',', $.percentage)),
      ')',
    ),

    hwb_color: $ => seq(
      'hwb', optional(token.immediate('a')), '(',
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
      /\a+/,
      optional(seq('/', $.percentage)),
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
      seq(field('value', $.integer_value), field('unit', $.integer_distance_unit)),
      seq(field('value', $.float_value), field('unit', $.float_distance_unit)),
      seq('calc', '(', repeat1($.distance_bin_expr), ')'),
    ),

    distance_bin_expr: $ => prec.left(seq(
      $.distance_value,
      choice('+', '-', '*', '/'),
      $.distance_value,
    )),

    integer_distance_unit: $ => choice(
      'px',
      'mm',
    ),

    float_distance_unit: $ => choice(
      'cm',
      'ph',
      '%'
    ),

    padding_value: $ => prec.left(seq(
      $.distance_value,
      $.distance_value,
      optional(seq(
        $.distance_value,
        optional($.distance_value),
      )),
    )),

    border_value: $ => prec.left(seq(
      $.border_style,
      optional(seq(
        $.border_style,
        optional(seq(
          $.border_style,
          optional($.border_style),
        )),
      )),
    )),

    border_style: $ => seq(
      field('size', $.distance_value),
      field('style', $.line_style_value),
    ),

    position_value: $ => prec.left(repeat1(choice(
      'center',
      'north',
      'east',
      'south',
      'west',
    ))),

    reference_value: $ => choice(
      seq('@', token.immediate(/[a-zA-Z-]/)),
      seq('var', '(', alias($.identifier, $.property_name), ',', $._value , ')'),
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
      sep(',', $._selector),
      ']',
    ),

    environ_value: $ => choice(
      seq('${', $.environ_name, '}' ),
      seq('env', '(', $.environ_name, ',', $._value , ')'),
    ),

    identifier: $ => prec(1, /[a-zA-Z][a-zA-Z0-9-]*/),

    environ_name: $ => /[:alnum:]+/,

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
