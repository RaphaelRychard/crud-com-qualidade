const baseURL = "http://localhost:3000";
describe("/ - Todo feed ", () => {
  it("when load, renders the page", () => {
    cy.visit("http://localhost:3000");
  });
  it.only("when create a new todo, it must appears in the screen", () => {
    // 0 - Interceptações/Interceptação
    cy.intercept("POST", `${baseURL}/api/todos`, (req) => {
      req.reply({
        statusCode: 201,
        body: {
          todo: {
            id: "5637479a-feae-417d-a3c1-5c5b0bfd57b5",
            date: "2024-02-11T14:54:20.364Z",
            content: "Digitar alguma Coisa",
            done: false,
          },
        },
      });
    }).as("createTodo");

    // 1 - Abrir pagina
    cy.visit("http://localhost:3000");

    // 2 - Seleciona input de criar nova todo
    const $inputAddTodo = cy.get("input[name='add-todo']");

    // 3 - Digita no input para criar nova todo
    $inputAddTodo.type("Test Todo");

    // 4 - Clica no botão
    const $btnAddTodo = cy.get("[aria-label='Adicionar novo item']");
    $btnAddTodo.click();

    // 5 Checar na página se surgiu um novo elemento
  });
});
