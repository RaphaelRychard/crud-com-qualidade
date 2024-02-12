const baseURL = "http://localhost:3000";
describe("/ - Todo feed ", () => {
  it("when load, renders the page", () => {
    cy.visit("http://localhost:3000");
  });
  it("when create a new todo, it must appears in the screen", () => {
    // 0 - Interceptações/Interceptação
    cy.intercept("POST", `${baseURL}/api/todos`, (req) => {
      req.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "5637479a-feae-417d-a3c1-5c5b0bfd57b5",
            date: "2024-02-11T14:54:20.364Z",
            content: "Test create new todo",
            done: false,
          },
        },
      });
    }).as("createTodo");

    // 1 - Abrir pagina
    cy.visit("http://localhost:3000");

    // 2 - Seleciona input de criar nova todo
    // 3 - Digita no input para criar nova todo
    const inputAddTodo = "input[name='add-todo']";
    cy.get(inputAddTodo).type("Test create new todo");

    // 4 - Clica no botão
    const buttonAddTodo = "[aria-label='Adicionar novo item']";
    cy.get(buttonAddTodo).click();

    // 5 Checar na página se surgiu um novo elemento
    cy.get("table > tbody").contains("Test create new todo");
  });
});
