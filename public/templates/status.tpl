<!-- IF info.maxplayers -->
    <div class="steamserverstatus-info">
        <p>Server name<span><span class="status -online"></span>{info.servername}</span></p>
        <p>Players<span>{info.numplayers}/{info.maxplayers}</span></p>
    </div>

    <!-- IF info.numplayers -->
        <div class="steamserverstatus-players">
            <!-- BEGIN players -->
                <div class="player">
                    <span class="name">{players.name}</span>
                    <span class="time">{players.duration}</span>
                </div>
            <!-- END players -->
        </div>
    <!-- ENDIF info.numplayers -->
<!-- ELSE -->
    <div class="steamserverstatus-info">
        <p><span class="status -offline"></span>Server is offline</p>
    </div>
<!-- ENDIF info.maxplayers -->
