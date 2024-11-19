export default function getCurrencySymbol(currencyCode: string) {
    try {
      // Create a number formatter with the given currency code
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
      });
      // Extract the currency symbol from the formatted string
      const parts = formatter.formatToParts(1);
      const currencySymbol = parts.find(part => part.type === 'currency')?.value;
      return currencySymbol || null;
    } catch (error) {
      console.error(`Error while getting currency symbol: ${error}`);
      return null;
    }
  }