const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статичні файли
app.use(express.static(path.join(__dirname, 'build')));

// Middleware для перевірки Firebase Auth Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', details: error.message });
  }
};

// Базовий маршрут для перевірки роботи сервера
app.get('/api/test', (req, res) => {
  res.json({ message: 'Сервер працює!' });
});

// Отримати всі тури
app.get('/api/tours', async (req, res) => {
  try {
    const snapshot = await db.collection('tours').get();
    const tours = [];
    snapshot.forEach(doc => {
      tours.push({ id: doc.id, ...doc.data() });
    });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання турів', details: error.message });
  }
});

// Додати новий тур (тільки для автентифікованих)
app.post('/api/tours', verifyToken, async (req, res) => {
  const { title, description, price, image, location, duration, rating, coordinates } = req.body;
  try {
    const newTour = {
      title,
      description,
      price,
      image,
      location,
      duration,
      rating: rating || null,
      coordinates
    };
    const docRef = await db.collection('tours').add(newTour);
    res.status(201).json({ id: docRef.id, ...newTour });
  } catch (error) {
    res.status(400).json({ error: 'Помилка додавання туру', details: error.message });
  }
});

// Захищений маршрут
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have accessed a protected route!', user: req.user });
});

// Обробка всіх інших маршрутів для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.get('/api/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання користувачів', details: error.message });
  }
});

// Реєстрація нового користувача
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res.status(201).json({ message: 'Користувача створено', user: userRecord });
  } catch (error) {
    res.status(400).json({ message: 'Помилка реєстрації', details: error.message });
  }
});

// Логін користувача (отримання токена)
// У Firebase логін зазвичай відбувається на клієнті, але для прикладу можна використати REST API Firebase
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Використовуємо REST API Firebase для логіну
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.FIREBASE_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    res.json({ idToken: data.idToken, refreshToken: data.refreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Помилка логіну', details: error.message });
  }
});

// Отримання профілю користувача (захищений маршрут)
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.json({ user: userRecord });
  } catch (error) {
    res.status(404).json({ message: 'Користувача не знайдено', details: error.message });
  }
});

// Чорний список слів для перевірки відгуків
const forbiddenWords = ["поганий", "лайка", "заборонене_слово1", "заборонене_слово2"];

// Додати відгук до туру (автентифікований користувач, з перевіркою на заборонені слова)
app.post('/api/tours/:tourId/reviews', verifyToken, async (req, res) => {
  const { tourId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.uid;
  const userName = req.user.name || req.user.email || "Anonymous";

  // Перевірка на заборонені слова
  const lowerComment = comment.toLowerCase();
  const hasForbidden = forbiddenWords.some(word => lowerComment.includes(word));
  if (hasForbidden) {
    return res.status(400).json({ error: 'Відгук містить заборонені слова!' });
  }

  try {
    const review = {
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };
    await db.collection('tours').doc(tourId).collection('reviews').add(review);
    res.status(201).json({ message: 'Відгук додано', review });
  } catch (error) {
    res.status(400).json({ error: 'Помилка додавання відгуку', details: error.message });
  }
});

// Отримати всі відгуки для туру, додати averageRating, сортувати за рейтингом
app.get('/api/tours/:tourId/reviews', async (req, res) => {
  const { tourId } = req.params;
  try {
    const snapshot = await db.collection('tours').doc(tourId).collection('reviews').get();
    let reviews = [];
    let sum = 0;
    snapshot.forEach(doc => {
      const data = { id: doc.id, ...doc.data() };
      reviews.push(data);
      sum += Number(data.rating) || 0;
    });
    // Сортування за рейтингом (від кращих до гірших)
    reviews.sort((a, b) => b.rating - a.rating);
    // Обчислення середнього рейтингу
    const averageRating = reviews.length ? (sum / reviews.length).toFixed(2) : null;
    res.json({ reviews, averageRating });
  } catch (error) {
    res.status(500).json({ error: 'Помилка отримання відгуків', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
}); 