require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const proposalRoutes = require('./routes/proposals');
const aiRoutes = require('./routes/ai');
const exportRoutes = require('./routes/export');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/export', exportRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ProposalAI server running on port ${PORT}`);
});
