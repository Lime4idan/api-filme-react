const publicUser = (user, { includeEmail = true, includeStats = false } = {}) => {
  const result = {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (includeEmail) result.email = user.email;
  if (includeStats && user._count) result.stats = user._count;
  return result;
};

module.exports = publicUser;
