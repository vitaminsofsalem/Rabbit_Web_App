export function mapCategoryToLabel(category: string) {
  switch (category) {
    default:
      return capitalizeFirstLetter(category);
  }
}

function capitalizeFirstLetter(str: string) {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
}
