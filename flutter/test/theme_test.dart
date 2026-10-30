import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:unipal_brand/unipal_brand.dart';

void main() {
  for (final brand in UnipalBrand.values) {
    test('${brand.displayName} builds light and dark themes', () {
      final light = UnipalTheme.light(brand);
      final dark = UnipalTheme.dark(brand);

      expect(light.colorScheme.primary, UnipalPalette.navy900);
      expect(light.colorScheme.secondary, brand.light.accent);
      expect(dark.colorScheme.secondary, brand.dark.accent);
      expect(dark.brightness, Brightness.dark);
      expect(light.extension<UnipalAccent>()!.brand, brand);
    });
  }
}
