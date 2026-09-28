# Pixel Bahçesi

Bağımlılıksız, Türkçe bir mini oyun arcade sitesi. Altı oyun içerir: Yılan, Hafıza Kartları, Taş Kağıt Makas, Refleks Testi, Sayı Tahmini ve Kelime Bulmaca. Skor ve oyun istatistikleri hesap açmadan tarayıcının `localStorage` alanında tutulur.

## Çalıştırma

`index.html` dosyasını doğrudan tarayıcıda açabilirsin. Alternatif olarak klasörde basit bir statik sunucu çalıştır:

```bash
python -m http.server 8000
```

Sonra `http://localhost:8000` adresini aç.

## Yapı

- `index.html` — erişilebilir uygulama kabuğu ve navigasyon
- `styles.css` — responsive arcade arayüzü, tema ve animasyonlar
- `app.js` — hash tabanlı router, altı oyun ve localStorage istatistikleri
