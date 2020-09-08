export default (context, inject) => {
  const audio = new Audio();
  inject("audio", audio);
};
