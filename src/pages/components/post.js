export default function Post({ username, description, picture }) {
  return (
    <div className="post">
      <div className="account-display">
        <img className="pfp" src={picture} alt="pfp"/>
        <h3>{username}</h3>
      </div>
      <p className="description">{description}</p>
    </div>
  );
}