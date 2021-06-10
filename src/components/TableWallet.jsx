import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExpense, sumExpenses } from '../actions';

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
    const { expenses } = this.props;
    return (
      expenses.map(({ id, description, tag, method, value, currency, exchangeRates }) => {
        const coin = exchangeRates[currency];
        return (
          <tr key={ id }>
            <td>{description}</td>
            <td>{tag}</td>
            <td>{method}</td>
            <td>{value}</td>
            <td>{coin.name}</td>
            <td>{parseFloat(coin.ask).toFixed(2)}</td>
            <td>{(coin.ask * value).toFixed(2)}</td>
            <td>Real</td>
            <button
              type="button"
              data-testid="delete-btn"
              onClick={ () => this.handleClickRemove(id) }
            >
              Deletar
            </button>
          </tr>
        );
      })
    );
  }

  render() {
    return (
      <table>
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
        <tbody>
          { this.TableExpenses() }
        </tbody>
      </table>
    );
  }
}

TableWallet.propTypes = {
  removeExpense: PropTypes.func.isRequired,
  addSumExpenses: PropTypes.func.isRequired,
  expenses: PropTypes.objectOf(Object).isRequired,
};

const mapStateToProps = ({ wallet: { expenses } }) => ({
  expenses,
});

const mapDispatchToProps = (dispatch) => ({
  removeExpense: (id) => dispatch(
    deleteExpense(id),
  ),
  addSumExpenses: () => dispatch(
    sumExpenses(),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableWallet);