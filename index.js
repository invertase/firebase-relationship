const pluralize = require('pluralize');
const namespace = 'firebase-relationship';

function cap(_s) {
  const s = _s.toLowerCase();
  return s[0].toUpperCase() + s.slice(1);
}

class Relationship {

  /**
   * Relationship name.
   * @param name
   * @param path
   */
  constructor(name, path = 'relationship') {
    if (path.startsWith('/') || path.endsWith('/')) {
      throw new Error(`[${namespace}] Invalid relationship path. Should not start or end with a / (forward slash).`);
    }

    const parts = name.split('_');

    if (parts.length !== 2) {
      throw new Error(`[${namespace}] Invalid relationship name. Must contain a single underscore e.g. "category_product"`);
    }

    const a = [parts[0], pluralize(parts[1])].join('_');
    const b = [parts[1], pluralize(parts[0])].join('_');

    this._relLeft = [cap(parts[0]), cap(pluralize(parts[1]))].join('');
    this._relRight = [cap(parts[1]), cap(pluralize(parts[0]))].join('');

    this._leftRef = `/${path}/${a}`;
    this._rightRef = `/${path}/${b}`;

    // create stub methods i.e getUserMatches & getMatchUsers
    this[`get${this._relLeft}`] = this._getLeftChildren.bind(this);
    this[`get${this._relRight}`] = this._getRightChildren.bind(this);
    
    // create stub get ref methods i.e getUserMatchesRef & getMatchUsersRef
    this[`get${this._relLeft}Ref`] = this._getLeftChildrenRef.bind(this);
    this[`get${this._relRight}Ref`] = this._getRightChildrenRef.bind(this);
  }

  /**
   *
   * @param firebase
   * @param aId
   * @param bId
   * @param value
   */
  join(firebase, aId, bId, value = true) {
    const db = firebase.database();
    const _value = value || Date.now();
    return Promise.all([
      db.ref(`${this._leftRef}/${aId}/${bId}`).set(_value),
      db.ref(`${this._rightRef}/${bId}/${aId}`).set(_value)
    ]);
  }

  /**
   *
   * @param firebase
   * @param aId
   * @param bId
   */
  remove(firebase, aId, bId) {
    const db = firebase.database();
    return Promise.all([
      db.ref(`${this._leftRef}/${aId}/${bId}`).remove(),
      db.ref(`${this._rightRef}/${bId}/${aId}`).remove()
    ]);
  }

  /**
   *
   * @param firebase
   * @param aId
   * @returns {Promise}
   * @private
   */
  _getLeftChildren(firebase, aId) {
    return this._getLeftChildrenRef(firebase, aId).once('value');
  }

  /**
   *
   * @param firebase
   * @param bId
   * @returns {Promise}
   * @private
   */
  _getRightChildren(firebase, bId) {
    return this._getRightChildrenRef(firebase, bId).once('value');
  }
  
  /**
   *
   * @param firebase
   * @param aId
   * @returns {Promise}
   * @private
   */
  _getLeftChildrenRef(firebase, aId) {
    return firebase.database().ref(`${this._leftRef}/${aId}`);
  }

  /**
   *
   * @param firebase
   * @param bId
   * @returns {Promise}
   * @private
   */
  _getRightChildrenRef(firebase, bId) {
    return firebase.database().ref(`${this._rightRef}/${bId}`);
  }
}

module.exports = Relationship;
