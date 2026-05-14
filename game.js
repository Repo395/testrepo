// Game State
const gameState = {
    currentPlayer: 0,
    players: [
        {
            name: 'Yuki',
            description: 'Asian Adventurer',
            level: 1,
            captures: 0,
            location: 'Starting Area',
            emoji: '🧑‍🦱'
        },
        {
            name: 'Emma',
            description: 'White Adventurer',
            level: 1,
            captures: 0,
            location: 'Starting Area',
            emoji: '👩‍🦰'
        }
    ],
    catsEncountered: [],
    beaufortFound: false,
    totalEncounters: 0
};

// Locations
const locations = [
    { name: 'Starting Area', emoji: '🏠', description: 'A peaceful starting town' },
    { name: 'Forest', emoji: '🌲', description: 'Dense green forest' },
    { name: 'Mountains', emoji: '⛰️', description: 'Tall mountain peaks' },
    { name: 'Beach', emoji: '🏖️', description: 'Sandy beach by the sea' },
    { name: 'Cave', emoji: '🕳️', description: 'Dark mysterious cave' },
    { name: 'City', emoji: '🏙️', description: 'Urban metropolis' },
    { name: 'Ruins', emoji: '🏛️', description: 'Ancient ruins' },
    { name: 'Sanctuary', emoji: '✨', description: 'Sacred sanctuary (Boss Location)' }
];

// Cats Database
const cats = [
    { name: 'Whiskers', power: 3, rarity: 'Common', emoji: '😺', description: 'A fluffy orange cat' },
    { name: 'Shadow', power: 5, rarity: 'Common', emoji: '🐈‍⬛', description: 'A sleek black cat' },
    { name: 'Mittens', power: 4, rarity: 'Uncommon', emoji: '🐱', description: 'A white cat with black patches' },
    { name: 'Tiger', power: 7, rarity: 'Uncommon', emoji: '😸', description: 'A bold striped cat' },
    { name: 'Luna', power: 8, rarity: 'Rare', emoji: '😻', description: 'A mystical lunar cat' },
    { name: 'Phoenix', power: 10, rarity: 'Legendary', emoji: '🐲', description: 'A legendary phoenix cat' },
    { name: 'Beaufort', power: 20, rarity: 'Legendary', emoji: '🐱', description: 'The legendary hairless cat - the one they seek!' }
];

// Initialize Game
function startGame() {
    hideAllScreens();
    document.getElementById('gameScreen').classList.add('active');
    generateMap();
    updatePlayerInfo();
    addEvent('Adventure begins! Welcome to Beaufort Quest!', 'info');
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

function showScreen(screenId) {
    hideAllScreens();
    document.getElementById(screenId).classList.add('active');
}

// Generate Map
function generateMap() {
    const mapDiv = document.getElementById('gameMap');
    mapDiv.innerHTML = '';

    locations.forEach((location, index) => {
        const tile = document.createElement('div');
        tile.className = 'map-tile';
        if (index === 0) tile.classList.add('active');
        tile.innerHTML = `<div style="font-size: 30px;">${location.emoji}</div><p>${location.name}</p>`;
        tile.onclick = () => moveToLocation(index);
        mapDiv.appendChild(tile);
    });
}

// Move to Location
function moveToLocation(index) {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    currentPlayer.location = locations[index].name;
    
    document.querySelectorAll('.map-tile').forEach(tile => tile.classList.remove('active'));
    document.querySelectorAll('.map-tile')[index].classList.add('active');
    
    document.getElementById('locationName').textContent = locations[index].name;
    addEvent(`${currentPlayer.name} traveled to ${locations[index].name}`, 'info');
    
    // Random encounter chance
    if (Math.random() > 0.4) {
        setTimeout(triggerEncounter, 1000);
    }
}

// Encounter System
function triggerEncounter() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    // Determine which cat to encounter
    let cat;
    if (gameState.totalEncounters > 15 && !gameState.beaufortFound) {
        cat = cats[cats.length - 1]; // Beaufort
    } else {
        cat = cats[Math.floor(Math.random() * (cats.length - 1))];
    }
    
    gameState.totalEncounters++;
    
    // Show encounter screen
    showScreen('encounterScreen');
    document.getElementById('encounterTitle').textContent = `${cat.name} appears!`;
    document.getElementById('encounterImage').textContent = cat.emoji;
    document.getElementById('encounterDescription').textContent = cat.description;
    document.getElementById('catPower').textContent = cat.power;
    document.getElementById('catRarity').textContent = cat.rarity;
    
    // Store current cat for capture attempt
    gameState.currentCat = cat;
    document.getElementById('captureMessage').textContent = '';
}

function attemptCapture() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const cat = gameState.currentCat;
    
    // Success chance based on cat power and player level
    const successRate = Math.max(0.3, 0.9 - (cat.power * 0.05) + (currentPlayer.level * 0.1));
    const success = Math.random() < successRate;
    
    const messageDiv = document.getElementById('captureMessage');
    
    if (success) {
        currentPlayer.captures++;
        currentPlayer.level = Math.floor(currentPlayer.captures / 3) + 1;
        gameState.catsEncountered.push(cat);
        
        messageDiv.textContent = `✓ Success! ${currentPlayer.name} captured ${cat.name}!`;
        messageDiv.style.color = '#27ae60';
        addEvent(`${currentPlayer.name} captured ${cat.name}!`, 'success');
        
        if (cat.name === 'Beaufort') {
            gameState.beaufortFound = true;
            setTimeout(() => showScreen('victoryScreen'), 2000);
        } else {
            setTimeout(() => {
                showScreen('gameScreen');
                updatePlayerInfo();
            }, 2000);
        }
    } else {
        messageDiv.textContent = `✗ Failed! ${cat.name} escaped!`;
        messageDiv.style.color = '#e74c3c';
        addEvent(`${currentPlayer.name} failed to capture ${cat.name}...`, 'failure');
        
        setTimeout(() => {
            showScreen('gameScreen');
        }, 2000);
    }
}

function fleeEncounter() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const cat = gameState.currentCat;
    
    addEvent(`${currentPlayer.name} fled from ${cat.name}!`, 'info');
    showScreen('gameScreen');
}

// Switch Character
function switchCharacter() {
    gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
    updatePlayerInfo();
    addEvent(`Switched to ${gameState.players[gameState.currentPlayer].name}!`, 'info');
}

// Explore (random encounter)
function explore() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    addEvent(`${currentPlayer.name} is exploring...`, 'info');
    setTimeout(triggerEncounter, 1000);
}

// Show Inventory
function showInventory() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const playerCats = gameState.catsEncountered.filter((_, i) => i < currentPlayer.captures);
    
    let inventoryText = `${currentPlayer.name}'s Captured Cats:\n\n`;
    if (playerCats.length === 0) {
        inventoryText += 'No cats captured yet!';
    } else {
        playerCats.forEach(cat => {
            inventoryText += `${cat.emoji} ${cat.name} (Power: ${cat.power}, ${cat.rarity})\n`;
        });
    }
    
    alert(inventoryText);
}

// Show Status
function showStatus() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const otherPlayer = gameState.players[gameState.currentPlayer === 0 ? 1 : 0];
    
    let statusText = `=== BEAUFORT QUEST STATUS ===\n\n`;
    statusText += `${currentPlayer.name} (${currentPlayer.description})\n`;
    statusText += `Level: ${currentPlayer.level}\n`;
    statusText += `Cats Captured: ${currentPlayer.captures}\n`;
    statusText += `Location: ${currentPlayer.location}\n\n`;
    statusText += `${otherPlayer.name} (${otherPlayer.description})\n`;
    statusText += `Level: ${otherPlayer.level}\n`;
    statusText += `Cats Captured: ${otherPlayer.captures}\n`;
    statusText += `Location: ${otherPlayer.location}\n\n`;
    statusText += `Total Encounters: ${gameState.totalEncounters}\n`;
    
    if (gameState.beaufortFound) {
        statusText += `\n✓ BEAUFORT FOUND! Quest Complete!`;
    } else {
        statusText += `\n🔍 Still searching for Beaufort...`;
    }
    
    alert(statusText);
}

// Update Player Info
function updatePlayerInfo() {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    document.getElementById('currentPlayerName').textContent = currentPlayer.name;
    document.getElementById('playerLevel').textContent = currentPlayer.level;
    document.getElementById('captureCount').textContent = currentPlayer.captures;
    document.getElementById('locationName').textContent = currentPlayer.location;
}

// Add Event to Log
function addEvent(message, type = 'info') {
    const eventLog = document.getElementById('eventLog');
    const eventElement = document.createElement('p');
    eventElement.className = `event ${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    eventElement.textContent = `[${timestamp}] ${message}`;
    
    eventLog.insertBefore(eventElement, eventLog.firstChild);
    
    // Keep only last 10 events
    while (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
    }
}

// Return to Menu
function returnToMenu() {
    // Reset game state
    gameState.currentPlayer = 0;
    gameState.catsEncountered = [];
    gameState.beaufortFound = false;
    gameState.totalEncounters = 0;
    gameState.players.forEach(player => {
        player.level = 1;
        player.captures = 0;
        player.location = 'Starting Area';
    });
    
    showScreen('titleScreen');
}

// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    showScreen('titleScreen');
});
