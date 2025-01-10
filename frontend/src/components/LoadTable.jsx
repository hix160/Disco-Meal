import PropType from 'prop-types';
import { useState } from 'react';

function LoadTable({ tableId, tableData, haveButtons, onCategorieClick }) {
    const [active, setActive] = useState(''); // Track active button

    const handleActive = (categoryId) => {
        setActive(categoryId); // Set the active button's ID
    };

    return (
        <div id={tableId}>
            {tableData && (
                <table>
                    <thead>
                        <tr>
                            <th>Kategorijas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    {haveButtons ? (
                                        <button
                                            className={active === row.category_id ? 'active' : ''}
                                            id={row.category_id}
                                            onClick={() => {
                                                onCategorieClick(row.category_id, row.category_name);
                                                handleActive(row.category_id); // Mark this button as active
                                            }}
                                        >
                                            {row.category_name}
                                        </button>
                                    ) : (
                                        row.category_name
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

LoadTable.propTypes = {
    tableId: PropType.string,
    tableData: PropType.array,
    haveButtons: PropType.bool,
    onCategorieClick: PropType.func.isRequired,
};

export default LoadTable;
