document.addEventListener('DOMContentLoaded', () => {
    const spacesList = document.getElementById('spacesList');
    let previousClickedItem = null;
  
    // Function to toggle background color and text color
    function toggleColors(li) {
      if (li.style.backgroundColor === 'red') {
        li.style.backgroundColor = 'white';
        li.style.color = 'black';
      } else {
        li.style.backgroundColor = 'red';
        li.style.color = 'white';
      }
    }
  
    // Event listener for clicks on space list items
    spacesList.addEventListener('click', (event) => {
      const clickedItem = event.target.closest('li');
      if (clickedItem && clickedItem.dataset.spaceId) {
        if (previousClickedItem !== null && previousClickedItem !== clickedItem) {
          toggleColors(previousClickedItem);
        }
        toggleColors(clickedItem);
        previousClickedItem = clickedItem;
      }
    });
  
    fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const today = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', dateOptions);
        document.getElementById('todaysDate').innerText = formattedDate;
  
        const addedSpaces = new Set();
        data.parking_lots.forEach(parkingLot => {
          if (parkingLot.name === 'Foy') {
            parkingLot.spaces.forEach(space => {
              if (space.space_id >= 1 && space.space_id <= 12 && !addedSpaces.has(space.space_id)) {
                const li = document.createElement('li');
                li.innerHTML = `
                  <strong>Space ID:</strong> ${space.space_id}<br>
                  <strong>Type:</strong> ${space.type}<br>
                  <strong>Status:</strong> ${space.status}<br>
                  <strong>Filled Datetime:</strong> ${space.filled_datetime ? space.filled_datetime.split(' ')[0] : ''}<br>
                  ${space.status === 'available' ? `<input type="date" placeholder="Enter time" required><br>` : ''}
                  <strong>Reserved Datetime:</strong> ${space.reserved_datetime ? space.reserved_datetime.split(' ')[0] : ''} 
                  ${space.status === 'available' ? `<input type="date" placeholder="Enter time" required><br>` : ''}
                `;
                li.dataset.spaceId = space.space_id; // Add dataset to identify space id
                spacesList.appendChild(li);
                addedSpaces.add(space.space_id);
              }
            });
          }
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  
  });
  