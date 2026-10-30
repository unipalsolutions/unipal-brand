import 'package:flutter/material.dart';

import 'tokens.g.dart';

/// Brand accent roles that Material's [ColorScheme] has no slot for.
/// Read them with `Theme.of(context).extension<UnipalAccent>()!`.
@immutable
class UnipalAccent extends ThemeExtension<UnipalAccent> {
  const UnipalAccent({required this.brand, required this.colors, required this.semantic});

  final UnipalBrand brand;
  final UnipalBrandColors colors;
  final UnipalSemanticColors semantic;

  @override
  UnipalAccent copyWith({UnipalBrand? brand, UnipalBrandColors? colors, UnipalSemanticColors? semantic}) =>
      UnipalAccent(
        brand: brand ?? this.brand,
        colors: colors ?? this.colors,
        semantic: semantic ?? this.semantic,
      );

  @override
  UnipalAccent lerp(UnipalAccent? other, double t) => t < 0.5 || other == null ? this : other;
}

/// Builds Material 3 themes from the generated tokens.
abstract final class UnipalTheme {
  static ThemeData light(UnipalBrand brand) => _build(brand, Brightness.light);

  static ThemeData dark(UnipalBrand brand) => _build(brand, Brightness.dark);

  static ThemeData _build(UnipalBrand brand, Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final s = isDark ? UnipalSemanticColors.dark : UnipalSemanticColors.light;
    final a = isDark ? brand.dark : brand.light;

    final scheme = ColorScheme(
      brightness: brightness,
      primary: s.primary,
      onPrimary: s.primaryForeground,
      secondary: a.accent,
      onSecondary: a.accentForeground,
      secondaryContainer: a.accentSubtle,
      onSecondaryContainer: a.accentText,
      tertiary: a.accentStrong,
      onTertiary: a.accentForeground,
      error: s.danger,
      onError: isDark ? UnipalPalette.ink900 : UnipalPalette.white,
      surface: s.background,
      onSurface: s.foreground,
      onSurfaceVariant: s.foregroundMuted,
      surfaceContainerLowest: s.background,
      surfaceContainerLow: s.surface,
      surfaceContainer: s.surface,
      surfaceContainerHigh: s.surfaceRaised,
      surfaceContainerHighest: s.surfaceRaised,
      outline: s.borderStrong,
      outlineVariant: s.border,
    );

    final textTheme = _textTheme(s.foreground);
    final shape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(UnipalRadius.md));
    const padding = EdgeInsets.symmetric(horizontal: UnipalSpace.s5, vertical: UnipalSpace.s3);

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: s.background,
      fontFamily: UnipalFonts.latin,
      fontFamilyFallback: UnipalFonts.fallback,
      textTheme: textTheme,
      dividerColor: s.border,
      extensions: [UnipalAccent(brand: brand, colors: a, semantic: s)],
      appBarTheme: AppBarTheme(
        backgroundColor: s.background,
        foregroundColor: s.foreground,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: textTheme.titleLarge,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: a.accent,
          foregroundColor: a.accentForeground,
          shape: shape,
          padding: padding,
          textStyle: textTheme.labelLarge,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: s.primary,
          foregroundColor: s.primaryForeground,
          shape: shape,
          padding: padding,
          elevation: 0,
          textStyle: textTheme.labelLarge,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: s.foreground,
          side: BorderSide(color: s.borderStrong),
          shape: shape,
          padding: padding,
          textStyle: textTheme.labelLarge,
        ),
      ),
      cardTheme: CardThemeData(
        color: s.surfaceRaised,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(UnipalRadius.lg),
          side: BorderSide(color: s.border),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: s.background,
        contentPadding: const EdgeInsets.symmetric(horizontal: UnipalSpace.s3, vertical: UnipalSpace.s3),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(UnipalRadius.md),
          borderSide: BorderSide(color: s.borderStrong),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(UnipalRadius.md),
          borderSide: BorderSide(color: s.borderStrong),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(UnipalRadius.md),
          borderSide: BorderSide(color: s.focusRing, width: 2),
        ),
      ),
    );
  }

  static TextTheme _textTheme(Color color) {
    TextStyle style(double size, FontWeight weight, double height) =>
        TextStyle(fontSize: size, fontWeight: weight, height: height, color: color);

    return TextTheme(
      displaySmall: style(UnipalFontSize.s4xl, UnipalFontWeight.bold, UnipalLineHeight.tight),
      headlineMedium: style(UnipalFontSize.s3xl, UnipalFontWeight.bold, UnipalLineHeight.tight),
      headlineSmall: style(UnipalFontSize.s2xl, UnipalFontWeight.bold, UnipalLineHeight.snug),
      titleLarge: style(UnipalFontSize.xl, UnipalFontWeight.semibold, UnipalLineHeight.snug),
      titleMedium: style(UnipalFontSize.lg, UnipalFontWeight.semibold, UnipalLineHeight.snug),
      bodyLarge: style(UnipalFontSize.base, UnipalFontWeight.regular, UnipalLineHeight.normal),
      bodyMedium: style(UnipalFontSize.sm, UnipalFontWeight.regular, UnipalLineHeight.normal),
      labelLarge: style(UnipalFontSize.sm, UnipalFontWeight.semibold, UnipalLineHeight.snug),
      bodySmall: style(UnipalFontSize.xs, UnipalFontWeight.medium, UnipalLineHeight.snug),
    );
  }
}
