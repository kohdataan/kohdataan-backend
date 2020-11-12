const calculateAge = (birthdate) => {
  const today = new Date();
  let thisYear = 0;
  if (today.getMonth() < birthdate.getMonth()) {
      thisYear = 1;
  } else if ((today.getMonth() === birthdate.getMonth()) && today.getDate() < birthdate.getDate()) {
      thisYear = 1;
  }
  var age = today.getFullYear() - birthdate.getFullYear() - thisYear;
  return age;
}

export default calculateAge