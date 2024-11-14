import { useState } from "react";
import { useEffect } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick, bgColor, color }) {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{ backgroundColor: bgColor, color: color }}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
  }

  function handleAddFriend() {
    if (!name || !image) {
      return;
    }

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id: id,
    };

    setFriends([...friends, newFriend]);
    setShowAddFriend(false);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  function handleSelectFriend(friend) {
    if (selectedFriend?.id === friend.id) {
      setSelectedFriend(null);
    } else {
      setSelectedFriend(friend);
    }
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends(
      friends.map((friend) => {
        return friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend;
      })
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && (
          <FormAddFriend
            onAddFriend={handleAddFriend}
            setName={setName}
            setImage={setImage}
            name={name}
            image={image}
          />
        )}
        <Button onClick={handleShowAddFriend} bgColor="#4b6cb7" color="#e0e7ff">
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend, setName, setImage, name, image }) {
  function handleSubmit(event) {
    event.preventDefault();
    onAddFriend();
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧍🏻‍♂️Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      ></input>

      <label> 🌠Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(event) => {
          setImage(event.target.value);
        }}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  useEffect(() => {
    setBill("");
    setPaidByUser("");
    setWhoIsPaying("User");
  }, [selectedFriend]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>🧾 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(event) => {
          setBill(Number(event.target.value));
        }}
      ></input>

      <label>💰 Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(event) => {
          setPaidByUser(
            Number(event.target.value) > bill
              ? paidByUser
              : Number(event.target.value)
          );
        }}
      ></input>

      <label>💰 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>

      <label>🤑 Who is paying the bill?</label>
      <select
        type="text"
        value={whoIsPaying}
        onChange={(event) => {
          setWhoIsPaying(event.target.value);
        }}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button bgColor="#4b6cb7" color="#e0e7ff">
        Split Bill
      </Button>
    </form>
  );
}
