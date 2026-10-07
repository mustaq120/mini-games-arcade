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

## Hacettepe öğrenci coğrafyası dashboard'u

`#hacettepe` rotası, Hacettepe öğrencilerinin illere göre dağılımını görselleştirmek için bağımsız bir MVP sunar. Başlangıç ekranındaki 10 satır **demo veridir; gerçek üniversite istatistiği değildir** ve gerçek sayılar iddia etmez. `CSV / JSON yükle` ile kendi verini tarayıcıda işleyebilirsin; dosya sunucuya gönderilmez.

Beklenen alanlar:

- CSV: `il,sayi,yil,kaynak` (virgül veya noktalı virgül kullanılabilir)
- JSON: `[{"il":"Ankara","sayi":120,"yil":"2023","kaynak":"YÖK Atlas"}]`

YÖK Atlas verisi bölüm/program bazında ve dinamik olabildiği için tek ve doğrulanmış bir Hacettepe il toplamı varsayılmadı. Atlas'tan veya kurumun doğruladığı raporlardan il bazındaki satırları dışa aktar, aynı yıl ve kapsamı kullandığını kontrol et, sonra bu formatta yükle. Yıl filtresi, ilk 10 yoğunluk listesi ve 1080×1350 PNG/SVG dışa aktarımı yüklenen veriye göre güncellenir.

Gerçek Türkiye il geometrisi bu bağımlılıksız projeye eklenmedi. Bunun yerine renkli, sıralı yoğunluk görünümü kullanıldı; bu yaklaşım mobilde erişilebilir ve harici CDN gerektirmez. Gelecekte doğrulanmış bir topojson/SVG kaynağı lisans ve veri sözlüğüyle projeye eklenebilir.

## Kelime listesi ve TDK notu

Kelime Bulmaca, oyunun ağ bağlantısı olmadan da çalışması için uygulama içine gömülü küçük ve elle seçilmiş bir Türkçe kelime listesi kullanır. TDK'nın resmi sitesinde bu kullanım için belgelenmiş, açık lisanslı ve toplu olarak indirilebilen bir kelime veri seti veya geliştirici API'si doğrulanamadı; bu nedenle projede TDK'dan alınmış gibi gösterilen bir veri ya da otomatik scraping yoktur. TDK sözlük içeriğini daha geniş ölçekte kullanmak için kurumdan ayrıca izin alınması gerekir. Liste, oyunun eğlence amaçlı fallback verisidir ve kapsamlı bir sözlük değildir.
