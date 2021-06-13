import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FaEdit, FaEraser } from 'react-icons/fa';
import { deleteExpense, sumExpenses, editExpense } from '../actions';

class TableWallet extends Component {
  constructor(props) {
    super(props);

    this.state = { };
    this.TableExpenses = this.TableExpenses.bind(this);
    this.handleClickRemove = this.handleClickRemove.bind(this);
  }

  handleClickRemove(id) {
    const { removeExpense, addSumExpenses } = this.props;
    removeExpense(id);
    addSumExpenses();
  }

  TableExpenses() {
    const { expenses, handleClickEdit } = this.props;
    return (
      expenses.map(({ id, description, tag, method, value, currency, exchangeRates }) => {
        const coin = exchangeRates[currency];
        return (
          <div key={ id } className="tableExpenses">
            <table className={ (id % 2 === 0) ? 'tableBody isEven' : 'tableBody' }>
              <tbody>
                <tr>
                  <td>{description}</td>
                  <td>{tag}</td>
                  <td>{method}</td>
                  <td>{value}</td>
                  <td>{coin.name}</td>
                  <td>{parseFloat(coin.ask).toFixed(2)}</td>
                  <td>{(coin.ask * value).toFixed(2)}</td>
                  <td>Real</td>
                </tr>
              </tbody>
            </table>
            <div className="areaButtons">
              <button
                type="button"
                data-testid="edit-btn"
                className="editButton"
                onClick={ () => handleClickEdit(id) }
              >
                <FaEdit className="editIcon" />
              </button>
              <button
                type="button"
                data-testid="delete-btn"
                className="eraseButton"
                onClick={ () => this.handleClickRemove(id) }
              >
                <FaEraser className="eraseIcon" />
              </button>
            </div>
          </div>
        );
      })
    );
  }

  render() {
    return (
      <div className="tableWallet">
        <table className="tableHeader">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
        </table>
        <div>
          { this.TableExpenses() }
        </div>
      </div>
    );
  }
}

TableWallet.propTypes = {
  removeExpense: PropTypes.func.isRequired,
  addSumExpenses: PropTypes.func.isRequired,
  handleClickEdit: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = ({ wallet: { expenses } }) => ({
  expenses,
});

const mapDispatchToProps = (dispatch) => ({
  removeExpense: (id) => dispatch(
    deleteExpense(id),
  ),
  handleClickEdit: (id) => dispatch(
    editExpense(id),
  ),
  addSumExpenses: () => dispatch(
    sumExpenses(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableWallet);
