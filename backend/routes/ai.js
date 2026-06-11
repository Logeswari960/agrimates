import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

const FARMING_RESPONSES = {
  weather: (farm) =>
    `Current conditions in **${farm.state}**: Clear skies, 28°C. Humidity 62%. No rain expected for 3 days — good for field work.\n\nSoil moisture: **68%** (optimal). Next irrigation recommended **Friday 6 AM**.`,
  market: () =>
    `**Today's Mandi Prices (Punjab):**\n\n• Wheat: ₹2,350/qtl (+1.2%)\n• Cotton: ₹6,800/qtl (+2.4%)\n• Mustard: ₹5,420/qtl (+0.8%)\n\nWheat prices trending upward — consider selling 40% of stored stock this week.`,
  irrigation: () =>
    `**Irrigation Schedule:**\n\nNo irrigation needed today. Soil moisture at 68%.\n\n• CRI stage (21 days): Critical 1st irrigation\n• Tillering (40–45 days): 2nd irrigation\n• Flowering (90 days): Most critical stage`,
  default: (query, farm) =>
    `Based on your farm (${farm.area} acres, ${farm.state}, ${farm.crops.join(' & ')}), here's my analysis for **"${query}"**:\n\nCurrent conditions look favorable. Soil moisture is at optimal 68%, temperature 28°C, and market prices are trending upward.\n\n**Recommendation:** Continue current practices and monitor field conditions.`,
};

function buildResponse(message, farm) {
  const lower = message.toLowerCase();
  if (lower.includes('weather') || lower.includes('rain') || lower.includes('temperature'))
    return { text: FARMING_RESPONSES.weather(farm), chips: ['Irrigation schedule', 'Pest forecast', 'Market prices'] };
  if (lower.includes('market') || lower.includes('price') || lower.includes('mandi') || lower.includes('sell'))
    return { text: FARMING_RESPONSES.market(), chips: ['Profit prediction', 'Best crop to sell', 'Storage tips'] };
  if (lower.includes('irrigation') || lower.includes('water') || lower.includes('moisture'))
    return { text: FARMING_RESPONSES.irrigation(), chips: ['Set reminder', 'Drip vs flood', 'Soil health'] };
  return { text: FARMING_RESPONSES.default(message, farm), chips: ['Tell me more', 'Set a reminder', 'Market outlook'] };
}

router.post('/chat', requireAuth, async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message is required' });

  const user = await User.findById(req.user.id);
  const farm = user?.farm || { state: 'Punjab', area: 12, crops: ['Wheat', 'Cotton'] };
  res.json(buildResponse(message.trim(), farm));
});

export default router;
