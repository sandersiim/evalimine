package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class MysqlQueryMapStatistics {
	
	private transient boolean isLoaded = false;
	
	private int regionId;
	private String winningPartyName;
	private double votePercent;
	
	private transient final MysqlConnectionHandler sqlHandler;
	
	
	public MysqlQueryMapStatistics(MysqlConnectionHandler sqlHandler) {
		this.sqlHandler = sqlHandler;
	}
	
	
	public List<MysqlQueryMapStatistics> queryAll() {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement(
					"SELECT *, (SELECT COUNT(*) FROM ev_users WHERE voteRegionId = a.id) AS totalVoters," +
							"(SELECT COUNT(*) FROM ev_candidates WHERE regionId = a.id) AS totalCandidates FROM ev_regions AS a");
			
			return fillMultiDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			// TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	
	private List<MysqlQueryMapStatistics> fillMultiDataFromResults(ResultSet results) throws SQLException {
		ArrayList<MysqlQueryMapStatistics> lines = new ArrayList<MysqlQueryMapStatistics>();
		
		while ( results.next() ) {
			lines.add(new MysqlQueryMapStatistics(null).fillDataFromNextResult(results));
		}
		
		return lines;
	}
	
	
	private MysqlQueryMapStatistics fillDataFromNextResult(ResultSet results) throws SQLException {
		isLoaded = true;
		
		regionId = results.getInt("id");
		winningPartyName = results.getString("winningPartyName");
		votePercent = results.getDouble("votePercent");
		
		return this;
	}
}
