const compatibleDonors = {
  "A+": ["A+", "A-", "O+", "O-"],

  "O+": ["O+", "O-"],

  "B+": ["B+", "B-", "O+", "O-"],

  "AB+": ["A+","A-","B+","B-","AB+","AB-","O+","O-",],

  "A-": ["A-", "O-"],

  "O-": ["O-"],

  "B-": ["B-", "O-"],
  
  "AB-": ["A-", "B-", "AB-", "O-"],
};

const getCompatibleDonorGroups = (recipientBloodGroup) => {
  return compatibleDonors[recipientBloodGroup] || [];
};

const isBloodCompatible = (
  donorBloodGroup,
  recipientBloodGroup
) => {
  return (
    compatibleDonors[recipientBloodGroup]?.includes(
      donorBloodGroup
    ) || false
  );
};

const getCompatibleRecipientGroups = (donorBloodGroup) => {
  return Object.keys(compatibleDonors).filter(
    (recipientBloodGroup) =>
      compatibleDonors[recipientBloodGroup].includes(
        donorBloodGroup
      )
  );
};

module.exports = {
  compatibleDonors,
  getCompatibleDonorGroups,
  getCompatibleRecipientGroups,
  isBloodCompatible,
};