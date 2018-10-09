// on construit une grille de 4x4 = 16 cases

// 8 paires d'images dispersées aléatoirement dans la grille

// au démarrage toutes les images sont retournées

// tant que toutes les images ne sont pas découvertes

// 1 tour
  // je clique sur une case : l'image 1 se retourne
  // j'essaie de voir où est la deuxième image de la paire
  // je clique sur une case : l'image 2 se retourne

  // si l'image 1 est identique à l'image 2
  // les 2 images restent découvertes

  // sinon, les 2 images se retournent

// fin de la boucle quand toutes les images sont découvertes => on a gagné


class Card {

  constructor(imgSrc) {
    this.src = imgSrc;
    this.state = 'down';
  }
}

class Game {

  constructor(aSideLength, aRootEl) {
    this.sideLength = aSideLength;
    this.grid = [];
    for (let i = 0; i < this.sideLength; i++ ) {
      this.grid[i] = [];
      for (let j = 0; j < this.sideLength; j++ ) {
        this.grid[i][j] = new Card("img_src_" + i + "_" + j);
      }
    }
    this.rootEl = document.getElementById(aRootEl);
  }

  draw() {
    const fragment = document.createDocumentFragment();
    this.rootEl.class = 'grid';
    for (let i = 0; i < this.sideLength; i++) {
      const newCard = document.createElement('div');
      newCard.innerText = 'Carte ' + i;
      fragment.appendChild(newElement);
    }
  }

  append() {

  }

  render() {

  }

}

