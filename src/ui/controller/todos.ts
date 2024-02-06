async function get() {
  return fetch("/api/todos")
    .then(async (responseServer) => {
      const todosString = await responseServer.text();
      const todosFromServer = JSON.parse(todosString).todos;
      console.log(todosFromServer);
      return todosFromServer;
    });
}

export const todoController = {
  get
};
