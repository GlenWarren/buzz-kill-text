/*
End-to-end testing using Cypress.

To install: `npm install cypress --save-dev`

Open: `npx cypress open` - This opens the Cypress Interactive Test Runner window
Run: `npx cypress run` - Runs tests headlessly
*/

describe('Buzz Kill Spec', () => {
    beforeEach(() => {
        cy.visit('index1.html');
    });
  
    it('should setup the game correctly', () => {
        cy.get('#wasp-nest').children().should('have.length', 14);
        cy.get('#wasp-health1').should('have.text', 80);
        cy.get('#wasp-health2').should('have.text', 68);
        cy.get('#wasp-health7').should('have.text', 60);
        cy.get('#attack-count').should('have.text', '0');
        cy.get('#alert').should('have.text', '');
        cy.get('button').should('have.text', 'ATTACK!');
    });

    it('should cause damage to a wasp, increment `Attack Count`, and display a message, when Attack! is activated', () => {
        cy.window().then((win) => {
            cy.stub(win, 'getTargetId').returns([5]); /* Stub the response of getTargetId(), to return a specific wasp id */
        });

        cy.get('button').contains('ATTACK!').click();

        cy.get('#wasp-health5').should('have.text', 58);
        cy.get('#attack-count').should('have.text', '1');
        cy.get('#alert').should('have.text', 'Calamus was hit!');
    });

    it('should display health as 0 and declare a wasp as dead when health is depleted after an attack', () => {
        cy.window().then((win) => {
            cy.stub(win, 'getTargetId').returns([3]); /* Targetting the same wasp everytime we attack */
        });

        for (let i = 0; i < 7; i++) {
            cy.get('button').contains('ATTACK!').click(); /* Attacking the wasp enough times to kill them */
        }

        cy.get('#attack-count').should('have.text', '7');
        cy.get('#wasp-health3').should('have.text', 0); /* The health should display 0, even if the health is a negative number */
        cy.get('#alert').should('have.text', 'Monstera is dead 💀');
    });
  
    it('should end the game correctly when the queen is killed, and then reset the game correctly when activated', () => {
        cy.window().then((win) => {
            cy.stub(win, 'getTargetId').returns([1]); /* Targetting the queen everytime we attack */
        });

        for (let i = 0; i < 12; i++) {
            cy.get('button').contains('ATTACK!').click(); /* Attacking the queen enough times to kill her */
        }

        for (let i = 1; i <= 14; i++) {
            cy.get(`#wasp-health${i}`).should('have.text', 0); /* It should deplete the health of all other wasps */
        }
        cy.get('#attack-count').should('have.text', '12');
        cy.get('#alert').should('have.text', `🏁🏁 GAME OVER 🏁🏁 // The Queen is dead 💀 and the wasp nest has been destroyed`);
        cy.get('button').should('have.text', 'NEW GAME'); /* It should display a `New Game` button */

        cy.get('button').contains('NEW GAME').click(); /* Activating a new game */

        cy.get('#attack-count').should('have.text', '0');
        cy.get('#alert').should('have.text', '');
        cy.get('button').should('have.text', 'ATTACK!');
        cy.get('#wasp-nest').children().should('have.length', 14);
        cy.get('#wasp-health1').should('have.text', 80);
        cy.get('#wasp-health2').should('have.text', 68);
        cy.get('#wasp-health7').should('have.text', 60);
    });

  });
  