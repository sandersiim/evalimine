package ee.ut.cs.veebirakendus2013.kurivaim.jettytest.mysql;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class MysqlQueryRegionInfo {
	
	private transient boolean isLoaded = false;
	
	private int regionId;
	private String keyword;
	private String displayName;
	private int mapCoordsX;
	private int mapCoordsY;
	
	private transient final MysqlConnectionHandler sqlHandler;
	
	
	public MysqlQueryRegionInfo(MysqlConnectionHandler sqlHandler) {
		this.sqlHandler = sqlHandler;
	}
	
	
	public List<MysqlQueryRegionInfo> queryAll() {
		PreparedStatement statement = null;
				
		try {
			statement = sqlHandler.getConnection().prepareStatement("SELECT * from ev_regions;");
			
			return fillMultiDataFromResults(statement.executeQuery());
		} catch (SQLException e) {
			// TODO: log this error somewhere
			e.printStackTrace();
		} finally {
			sqlHandler.statementCloser(statement);
		}
		
		return null;
	}
	
	
	private List<MysqlQueryRegionInfo> fillMultiDataFromResults(ResultSet results) throws SQLException {
		ArrayList<MysqlQueryRegionInfo> lines = new ArrayList<MysqlQueryRegionInfo>();
		
		while ( results.next() ) {
			lines.add(new MysqlQueryRegionInfo(null).fillDataFromNextResult(results));
		}
		
		return lines;
	}
	
	
	private MysqlQueryRegionInfo fillDataFromNextResult(ResultSet results) throws SQLException {
		isLoaded = true;
		
		regionId = results.getInt("id");
		keyword = results.getString("keyword");
		displayName = results.getString("displayName");
		mapCoordsX = results.getInt("mapCoordsX");
		mapCoordsY = results.getInt("mapCoordsY");
		
		return this;
	}
	
	
	public boolean isFilled() {
		return isLoaded;
	}
	
	
	public int getRegionId() {
		return regionId;
	}
	
	
	public String getKeyword() {
		return keyword;
	}
	
	
	public String getDisplayName() {
		return displayName;
	}
	
	
	public int getMapCoordsX() {
		return mapCoordsX;
	}
	
	
	public int getMapCoordsY() {
		return mapCoordsY;
	}

}
