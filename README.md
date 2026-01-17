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

## 📋 API Endpoint Listesi

Aşağıda projede bulunan tüm REST API kaynakları listelenmiştir.

### 👤 Users (Kullanıcılar)
| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/users` | Yeni kullanıcı oluşturur |
| GET | `/api/users` | Tüm kullanıcıları listeler |
| GET | `/api/users/:id` | ID'ye göre kullanıcı detayını getirir |
| PATCH | `/api/users/:id` | Kullanıcı bilgilerini günceller |
| DELETE| `/api/users/:id` | Kullanıcıyı siler |

### 📦 Products (Ürünler)
| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/products` | Yeni ürün ekler |
| GET | `/api/products` | Tüm ürünleri listeler |
| GET | `/api/products/:id` | ID'ye göre ürün detayını getirir |
| PATCH | `/api/products/:id` | Ürün bilgilerini günceller |
| DELETE| `/api/products/:id` | Ürünü siler |

### 📂 Categories (Kategoriler)
| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/categories` | Yeni kategori oluşturur |
| GET | `/api/categories` | Tüm kategorileri listeler |
| GET | `/api/categories/:id`| Kategori detayını getirir |
| PATCH | `/api/categories/:id`| Kategoriyi günceller |
| DELETE| `/api/categories/:id`| Kategoriyi siler |

### 🛒 Orders (Siparişler)
| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/orders` | Yeni sipariş oluşturur (Stok düşer) |
| GET | `/api/orders` | Tüm siparişleri listeler |
| GET | `/api/orders/:id` | Sipariş detayını getirir |

### ⭐ Reviews (Değerlendirmeler)
| Metod | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/reviews` | Ürüne yorum ekler |
| GET | `/api/reviews/product/:productId` | Ürüne ait yorumları getirir |
| DELETE| `/api/reviews/:id` | Yorumu siler |

---

## 💻 Kullanım Örnekleri (cURL)

**1. Yeni Kullanıcı Oluşturma:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "ahmet@test.com", "name": "Ahmet Yilmaz", "password": "securepassword"}'
```

**2. Ürün Listeleme:**
```bash
curl http://localhost:3000/api/products
```

**3. Sipariş Oluşturma:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "items": [
      { "productId": 1, "quantity": 2 }
    ]
  }'
```

