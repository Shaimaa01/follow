async function fetchAll(url) {
    let allData = [];
    let page = 1;
    let totalPages = 1;
  
    do {
        const response = await fetch(`${url}?page=${page}`);
        const data = await response.json();
        allData = allData.concat(data);
        totalPages = response.headers.get('Link') ? 
                     (response.headers.get('Link').match(/page=(\d+)>; rel="last"/) ? parseInt(response.headers.get('Link').match(/page=(\d+)>; rel="last"/)[1]) : 1) : 1;
        page++;
    } while (page <= totalPages);
  
    return allData;
  }
  
  async function getFollowersAndFollowing() {
    const username = "Shaimaa01"; // Your GitHub username
    const userUrl = `https://api.github.com/users/${username}`;
  
    try {
        // Fetch user data to get counts
        const userResponse = await fetch(userUrl);
        const userData = await userResponse.json();
        const followersCount = userData.followers;
        const followingCount = userData.following;
  
        // Fetch all followers and following lists
        const followers = await fetchAll(`https://api.github.com/users/${username}/followers`);
        const following = await fetchAll(`https://api.github.com/users/${username}/following`);
  
        // Create a Set of follower usernames for easy comparison
        const followerUsernames = new Set(followers.map(user => user.login));
  
        // Find users you follow but who don't follow you back
        const nonFollowerDetails = following.map((user, index) => {
            if (!followerUsernames.has(user.login)) {
                return { username: user.login, index: index + 1 }; // +1 for 1-based index
            }
            return null;
        }).filter(user => user !== null); // Remove null values
  
        // Output counts
        console.log(`You have ${followersCount} followers.`);
        console.log(`You are following ${followingCount} accounts.`);
        console.log(`Users you follow but who don't follow you back (${nonFollowerDetails.length}):`, nonFollowerDetails);
  
        // Display the names and their indices
        if (nonFollowerDetails.length > 0) {
            console.log("They are:");
            nonFollowerDetails.forEach(user => console.log(`${user.index}: ${user.username}`));
        } else {
            console.log("Everyone you follow follows you back!");
        }
  
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }
  
  getFollowersAndFollowing();