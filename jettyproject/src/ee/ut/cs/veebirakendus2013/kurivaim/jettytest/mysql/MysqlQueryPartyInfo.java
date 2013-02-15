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
		try {
			PreparedStatement statement = sqlHandler.getConnection().prepareStatement(
					"SELECT a.id AS id, a.keyword AS keyword, a.displayName AS displayName, COALESCE(SUM(b.voteCount), 0) AS voteCount FROM ev_parties AS a" +
					"LEFT JOIN ev_candidates AS b ON a.id = b.partyId WHERE a.id = ? GROUP BY a.id LIMIT 1");
			statement.setInt(1, queryPartyId);
			
			return fillSingleDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
		}
		
		return null;
	}
	
	public List<MysqlQueryPartyInfo> queryAllByFilter(int queryRegionId, int orderingMethod) {
		try {
			String orderingString = (orderingMethod == 0) ? " ORDER BY voteCount DESC" : " ORDER BY displayName ASC";
			String regionFilter = (queryRegionId > 0) ? " AND b.regionId = " + queryRegionId : "";
			
			PreparedStatement statement = sqlHandler.getConnection().prepareStatement(
					"SELECT a.id AS id, a.keyword AS keyword, a.displayName AS displayName, COALESCE(SUM(b.voteCount), 0) AS voteCount FROM ev_parties AS a " +
					"LEFT JOIN ev_candidates AS b ON a.id = b.partyId WHERE 1" + regionFilter + " GROUP BY a.id" + orderingString);
			
			return fillMultiDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			//TODO: log this error somewhere
			e.printStackTrace();
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
