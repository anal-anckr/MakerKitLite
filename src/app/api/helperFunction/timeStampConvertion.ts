// here given timestamp converted into supabase timestamp
function formatDate(date: Date) {
  // Get date components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');

  // Get time components
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  // Get milliseconds and format to microseconds by adding extra zeros
  const milliseconds =
    String(date.getUTCMilliseconds()).padStart(3, '0') + '000'; // Adding 3 extra zeros to match microsecond precision

  // Combine date and time components
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;
}
