import type { ContentItem } from './types';

const item = (
  id: string,
  type: string,
  title: string,
  subtitle: string,
  description: string,
): ContentItem => ({ _id: id, type, title, subtitle, description, order: 0 });

export const storyFallback = [
  item('story-1', 'story', 'A simple hello', 'How we met', 'A mutual friend introduced us over coffee in Lagos. The conversation lasted much longer than either of us planned.'),
  item('story-2', 'story', 'Growing together', 'Our journey', 'Through the ordinary days and the big milestones, we learned that friendship is the sweetest foundation for love.'),
  item('story-3', 'story', 'The question', 'Our engagement', 'On a beautiful evening surrounded by the people we love, Joseph asked and Praise said yes.'),
];

export const coupleFallback = [
  item('bride', 'couple', 'Praise Adeyemi', 'The bride', 'Warm-hearted, thoughtful, and always ready to host family and friends with a beautiful smile.'),
  item('groom', 'couple', 'Joseph Okafor', 'The groom', 'Calm, joyful, and deeply grateful to begin this next chapter alongside his best friend.'),
];

export const partyFallback = [
  item('chief-bridesmaid', 'party', 'Amara Okafor', 'Chief bridesmaid', 'Praise’s sister and lifelong best friend.'),
  item('best-man', 'party', 'David Nwosu', 'Best man', 'Joseph’s brother and trusted friend.'),
  item('bride-parents', 'party', 'Mr. & Mrs. Adeyemi', 'Parents of the bride', 'With love and thanksgiving.'),
  item('groom-parents', 'party', 'Mr. & Mrs. Okafor', 'Parents of the groom', 'With joy and blessing.'),
];

export const dressCodeFallback = [
  item('traditional-dress', 'dress-code', 'Traditional Wedding', 'Champagne & wine', 'Elegant native attire. Guests wearing Aso-Ebi are encouraged to pair it with wine accessories.'),
  item('church-dress', 'dress-code', 'Church Wedding', 'Sunday best', 'Modest formal wear suitable for a church service.'),
  item('reception-dress', 'dress-code', 'Reception', 'Formal glamour', 'Dress to celebrate. Comfortable shoes are welcome for the dance floor.'),
];

export const asoEbiFallback = [
  item('aso-ebi', 'aso-ebi', 'Champagne lace', 'Aso-Ebi fabric', 'Available at ₦35,000 per 5 yards. Contact the wedding coordinator to reserve your fabric and receive payment details.'),
];

export const accommodationFallback = [
  item('hotel-1', 'accommodation', 'The Avenue Suites', 'Lekki Phase 1', 'A comfortable option close to the wedding venues. Contact the hotel directly for wedding guest rates.'),
  item('hotel-2', 'accommodation', 'Harbour View Hotel', 'Victoria Island', 'A stylish stay with easy access to Lekki and central Lagos.'),
];

export const faqFallback = [
  item('faq-1', 'faq', 'What time should I arrive?', 'Arrival', 'Please arrive 30 minutes before each event begins so that the programme can start on time.'),
  item('faq-2', 'faq', 'Is Aso-Ebi compulsory?', 'Dress code', 'No. It is completely optional, but we would love for you to celebrate in the wedding colours if you can.'),
  item('faq-3', 'faq', 'Can I bring a guest?', 'RSVP', 'Please include every guest in your RSVP. We will confirm available space with you.'),
  item('faq-4', 'faq', 'Will parking be available?', 'Venue', 'Yes. Parking information and venue directions will be included on the venue page.'),
];

export const donorFallback = [
  item('donor-1', 'donor', 'John & Mary', 'People who have blessed us', 'Thank you for celebrating our union with us.'),
  item('donor-2', 'donor', 'The Okafor Family', 'People who have blessed us', 'Thank you for your love and support.'),
  item('donor-3', 'donor', 'The Adeyemi Family', 'People who have blessed us', 'Thank you for your generous hearts.'),
];
