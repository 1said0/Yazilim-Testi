# Yazılım Testi Dönem Projesi

![CI](https://github.com/1said0/Yazilim-Testi/actions/workflows/ci.yml/badge.svg)
![Codecov](https://img.shields.io/codecov/c/github/1said0/Yazilim-Testi)

Bu proje, **Yazılım Testi** dersi kapsamında geliştirilmiş, kapsamlı test senaryolarını içeren bir REST API uygulamasıdır. Kullanıcı, Ürün, Kategori, Sipariş ve Değerlendirme yönetimi özelliklerini içerir.

## 🚀 Kurulum

1.  Projeyi klonlayın:
    ```bash
    git clone https://github.com/1said0/Yazilim-Testi.git
    cd Yazilim-Testi
    ```

2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

3.  `.env` dosyasını oluşturun:
    ```bash
    cp .env.example .env
    # DATABASE_URL bilgilerinizi güncelleyin
    ```

4.  Veritabanını hazırlayın:
    ```bash
    npx prisma migrate dev
    npx prisma generate
    ```

## 🧪 Testler

Proje %100 Unit Test kapsamı ve Kritik Entegrasyon testleri ile donatılmıştır.

### 1. Unit Testler (Birim Testleri)
Servislerin izole edilmiş mantık testleridir.
```bash
npm run test:unit
```

### 2. Integration Testler (Entegrasyon Testleri)
Veritabanı ile etkileşimli, gerçek senaryo testleridir (Kullanıcı kaydı, Sipariş verme, Stok düşme vb.).
```bash
npm run test:int
```

### 3. E2E Testler (Uçtan Uca Testler)
Sistemin baştan sona (Admin ürün ekle -> Kullanıcı satın al) çalıştığını doğrulayan senaryodur.
```bash
npm run test:e2e
```

### 4. Tüm Testleri Çalıştır
```bash
npm test
```

## ⚙️ CI/CD (Sürekli Entegrasyon)
GitHub Actions yapılandırması `.github/workflows/ci.yml` dosyasında mevcuttur. Her `push` işleminde:
*   PostgreSQL servisi ayağa kalkar.
*   Unit ve Entegrasyon testleri otomatik koşulur.
*   **Codecov** ile test kapsama raporu oluşturulur (%60+ Coverage).
*   Hata varsa kod reddedilir.

## 📚 API Dokümantasyonu
Proje çalıştığında Swagger arayüzüne erişebilirsiniz:
`http://localhost:3000/api-docs`
