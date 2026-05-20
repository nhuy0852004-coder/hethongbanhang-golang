export default function BangDangTai({
    soCot = 6,
    soDong = 6,
  }) {
    return (
      <div className="bang-loading">
        <table className="bang-du-lieu">
          <thead>
            <tr>
              {Array.from({ length: soCot }).map((_, index) => (
                <th key={index}>
                  <div className="skeleton skeleton-text"></div>
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {Array.from({ length: soDong }).map((_, dong) => (
              <tr key={dong}>
                {Array.from({ length: soCot }).map((_, cot) => (
                  <td key={cot}>
                    <div className="skeleton skeleton-text"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }