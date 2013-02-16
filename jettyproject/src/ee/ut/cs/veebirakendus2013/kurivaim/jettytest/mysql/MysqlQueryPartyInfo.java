package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MysqlQueryPartyInfo {
	private transient boolean isLoaded = false;
	
	private int partyId;
	private String keyword;
	private String displayName;
	private int voteCount;
	
	private final MysqlConnectionHandler sqlHandler;
	
	public MysqlQueryPartyInfo(MysqlConnectionHandler sqlHandler) {
		this.sqlHandler = sqlHandler;
	}
	
	public MysqlQueryPartyInfo querySingleByPartyId(int queryPartyId) {
		PreparedStatement statement = null;
		
		try {
			statement = sqlHandler.getConnection().prepareStatement(
					"SELECT a.id AS id, a.keyword AS keyword, a.displayName AS displayName, COALESCE(SUM(b.voteCount), 0) AS voteCount FROM ev_parties AS a" +
					"LEFT JOIN ev_candidates AS b ON a.id = b.partyId WHERE a.id = ? GROUP BY a.id LIMIT 1");
			statement.setInt(1, queryPartyId);
			
			return fillSingleDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	public List<MysqlQueryPartyInfo> queryAllByFilter(int queryRegionId, int orderingMethod) {
		PreparedStatement statement = null;
		
		try {
			String orderingString = "";
			
			if(orderingMethod == 1) orderingString = " ORDER BY id ASC";
			else if(orderingMethod == 2) orderingString = " ORDER BY id DESC";
			else if(orderingMethod == 3) orderingString = " ORDER BY voteCount ASC";
			else if(orderingMethod == 4) orderingString = " ORDER BY voteCount DESC";
			else if(orderingMethod == 5) orderingString = " ORDER BY displayName ASC";
			else if(orderingMethod == 6) orderingString = " ORDER BY displayName DESC";
			
			String regionFilter = (queryRegionId > 0) ? " AND b.regionId = " + queryRegionId : "";
			
			statement = sqlHandler.getConnection().prepareStatement(
					"SELECT a.id AS id, a.keyword AS keyword, a.displayName AS displayName, COALESCE(SUM(b.voteCount), 0) AS voteCount FROM ev_parties AS a " +
					"LEFT JOIN ev_candidates AS b ON a.id = b.partyId WHERE 1" + regionFilter + " GROUP BY a.id" + orderingString);
			
			return fillMultiDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	private MysqlQueryPartyInfo fillSingleDataFromResults(ResultSet results) throws SQLException {
		if(results.next()) {
			return fillDataFromNextResult(results);
		}
		
		return null;
	}
	
	private List<MysqlQueryPartyInfo> fillMultiDataFromResults(ResultSet results) throws SQLException {
		ArrayList<MysqlQueryPartyInfo> lines = new ArrayList<MysqlQueryPartyInfo>();
		
		while(results.next()) {
			lines.add(new MysqlQueryPartyInfo(null).fillDataFromNextResult(results));
		}
		
		return lines;
	}
	
	private MysqlQueryPartyInfo fillDataFromNextResult(ResultSet results) throws SQLException {
		isLoaded = true;
		
		partyId = results.getInt("id");
		keyword = results.getString("keyword");
		displayName = results.getString("displayName");
		voteCount = results.getInt("voteCount");
		
		return this;
	}
	
	public boolean isFilled() {
		return isLoaded;
	}
	
	public int getPartyId() {
		return partyId;
	}
	
	public String getKeyword() {
		return keyword;
	}
	
	public String getDisplayName() {
		return displayName;
	}
	
	public int getVoteCount() {
		return voteCount;
	}
}
