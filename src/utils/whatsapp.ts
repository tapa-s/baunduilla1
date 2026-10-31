/**
 * WhatsApp click-to-chat helper for Baunduilla
 * Number is clean digits including country code (e.g. 919876543210 for India)
 */

export function cleanPhoneNumber(rawPhone: string): string {
  // Strip any non-numeric characters (+, spaces, hyphens, brackets)
  return rawPhone.replace(/\D/g, '');
}

export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const cleanNumber = cleanPhoneNumber(phoneNumber);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function createPackageWhatsAppMessage(
  packageTitle: string,
  travelDate?: string,
  travellerCount?: number
): string {
  let text = `Hello Baunduilla,\n\nI am interested in the tour package: *${packageTitle}*.\n`;
  if (travelDate) {
    text += `Preferred Date: ${travelDate}\n`;
  }
  if (travellerCount && travellerCount > 0) {
    text += `Number of Travellers: ${travellerCount}\n`;
  }
  text += `Please share the complete itinerary, confirmed pricing, available departure batches, and booking procedure.\n\nThank you!`;
  return text;
}

export function createDestinationWhatsAppMessage(
  destinationName: string
): string {
  return `Hello Baunduilla,\n\nI am planning a trip to *${destinationName}* and would love to know about your custom itineraries, travel packages, and best seasonal recommendations.\n\nPlease connect with me. Thank you!`;
}

export function createCustomPlanWhatsAppMessage(plan: {
  customerName: string;
  destination: string;
  startingCity?: string;
  travelDate?: string;
  adults: number;
  children: number;
  budgetPerPerson?: string;
  travelStyle?: string;
  requirements?: string;
}): string {
  return `Hello Baunduilla,\n\nI would like to plan a custom trip with you!\n\n` +
    `*Traveller:* ${plan.customerName}\n` +
    `*Destination:* ${plan.destination}\n` +
    (plan.startingCity ? `*Starting City:* ${plan.startingCity}\n` : '') +
    (plan.travelDate ? `*Preferred Dates:* ${plan.travelDate}\n` : '') +
    `*Group Size:* ${plan.adults} Adults${plan.children ? `, ${plan.children} Children` : ''}\n` +
    (plan.budgetPerPerson ? `*Budget / Person:* ${plan.budgetPerPerson}\n` : '') +
    (plan.travelStyle ? `*Travel Style:* ${plan.travelStyle}\n` : '') +
    (plan.requirements ? `*Special Notes:* ${plan.requirements}\n` : '') +
    `\nPlease share a customized itinerary and quote. Thanks!`;
}

export function createGeneralInquiryWhatsAppMessage(): string {
  return `Hello Baunduilla,\n\nI would like to inquire about your upcoming group tours, treks, and custom holiday planning. Looking forward to speaking with a travel coordinator!`;
}
