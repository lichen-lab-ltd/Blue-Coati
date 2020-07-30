let local = {};

local.get = (_key) => {
  let localData = null;
  let _s = localStorage.getItem(_key);
  if (_s) {
    localData = JSON.parse(_s);
  }
  local['data'] = localData;
};

local.write = (_key, _val) => {
  localStorage.setItem(_key, JSON.stringify(_val));
};

export default local;
